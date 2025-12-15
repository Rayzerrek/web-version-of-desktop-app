import { apiFetch, authHeaders } from "./ApiClient";

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  total_xp: number;
  level: number;
  current_streak_days: number;
  longest_streak_days: number;
  joined_at?: string;
}

export interface UserStatistics {
  total_lessons_completed: number;
  total_courses_completed: number;
  total_minutes_spent: number;
  average_score: number;
  lessons_this_week: number;
}

export class UserProfileService {
  async getUserProfile(userId: string): Promise<UserProfile> {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token");

    const profile = await apiFetch<UserProfile>(`/users/${userId}/profile`, {
      headers: authHeaders(token),
    });

    return {
      ...profile,
      total_xp: profile.total_xp ?? 0,
      level: profile.level ?? 1,
      current_streak_days: profile.current_streak_days ?? 0,
      longest_streak_days: profile.longest_streak_days ?? 0,
    };
  }

  async getUserStatistics(userId: string): Promise<UserStatistics> {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token");

    return await apiFetch<UserStatistics>(`/users/${userId}/statistics`, {
      headers: authHeaders(token),
    });
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<void> {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token");

    await apiFetch(`/users/${userId}/avatar`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ avatar_url: avatarUrl }),
    });
  }

  async updateUsername(userId: string, username: string): Promise<void> {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token");

    await apiFetch(`/users/${userId}/username`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ username }),
    });
  }
}

export const userProfileService = new UserProfileService();
