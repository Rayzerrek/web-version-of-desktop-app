import { apiFetch, authHeaders } from "./ApiClient";
import { getAccessToken, isGuestMode } from "../utils/auth";

export interface UserProgress {
  id?: string;
  user_id: string;
  lesson_id: string;
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  attempts: number;
  completed_at?: string;
  time_spent_seconds?: number;
}

export interface CreateProgressInput {
  user_id: string;
  lesson_id: string;
  status: string;
  score?: number;
  attempts: number;
  completed_at?: string;
  time_spent_seconds?: number;
}

class ProgressService {
  private getGuestProgressKey(userId: string): string {
    return `guest_progress_${userId}`;
  }

  private readGuestProgress(userId: string): UserProgress[] {
    const raw = localStorage.getItem(this.getGuestProgressKey(userId));
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as UserProgress[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeGuestProgress(userId: string, progress: UserProgress[]) {
    localStorage.setItem(
      this.getGuestProgressKey(userId),
      JSON.stringify(progress),
    );
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    const token = getAccessToken();
    if (!token) {
      if (isGuestMode()) {
        return this.readGuestProgress(userId);
      }
      throw new Error("No access token");
    }

    return await apiFetch<UserProgress[]>(
      `/progress/users/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: authHeaders(token),
      },
    );
  }

  async updateLessonProgress(
    userId: string,
    lessonId: string,
    status: "not_started" | "in_progress" | "completed",
    options?: {
      score?: number;
      attempts?: number;
    },
  ): Promise<UserProgress> {
    const token = getAccessToken();
    if (!token) {
      if (isGuestMode()) {
        const existing = this.readGuestProgress(userId);
        const now = new Date().toISOString();
        const current = existing.find((p) => p.lesson_id === lessonId);

        const updated: UserProgress = {
          id: current?.id,
          user_id: userId,
          lesson_id: lessonId,
          status,
          score: options?.score ?? current?.score,
          attempts: options?.attempts ?? current?.attempts ?? 1,
          completed_at: status === "completed" ? now : current?.completed_at,
          time_spent_seconds: current?.time_spent_seconds,
        };

        const next = current
          ? existing.map((p) =>
              p.lesson_id === lessonId ? updated : p,
            )
          : [...existing, updated];

        this.writeGuestProgress(userId, next);
        return updated;
      }
      throw new Error("No access token");
    }

    const progressData: CreateProgressInput = {
      user_id: userId,
      lesson_id: lessonId,
      status,
      score: options?.score,
      attempts: options?.attempts || 1,
      completed_at:
        status === "completed" ? new Date().toISOString() : undefined,
    };

    return await apiFetch<UserProgress>(`/progress`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(progressData),
    });
  }

  async markLessonCompleted(
    userId: string,
    lessonId: string,
  ): Promise<UserProgress> {
    return this.updateLessonProgress(userId, lessonId, "completed");
  }

  async markLessonInProgress(
    userId: string,
    lessonId: string,
  ): Promise<UserProgress> {
    return this.updateLessonProgress(userId, lessonId, "in_progress");
  }

  getLessonProgress(
    allProgress: UserProgress[],
    lessonId: string,
  ): UserProgress | undefined {
    return allProgress.find((p) => p.lesson_id === lessonId);
  }

  calculateCourseProgress(
    allProgress: UserProgress[],
    lessonIds: string[],
  ): number {
    if (lessonIds.length === 0) return 0;

    const completedCount = lessonIds.filter((id) => {
      const progress = this.getLessonProgress(allProgress, id);
      return progress?.status === "completed";
    }).length;

    return Math.round((completedCount / lessonIds.length) * 100);
  }
}

export const progressService = new ProgressService();
