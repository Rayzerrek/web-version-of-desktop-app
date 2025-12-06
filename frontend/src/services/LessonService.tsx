import type {
  Course,
  Lesson,
  Module,
  LessonContent,
  Difficulty,
  LessonType,
  CreateCourseDTO,
  CreateModuleDTO,
  CreateLessonDTO,
  Language,
} from '../types/lesson'
import { apiFetch, authHeaders } from './ApiClient'

export class LessonService {
  private cache = new Map<string, Course>()

  async getCourses(refresh = false): Promise<Course[]> {
    if (!refresh && this.cache.size > 0) {
      return Array.from(this.cache.values())
    }

    const token = localStorage.getItem('access_token')
    const rawCourses = await apiFetch<any[]>(`/courses`, {
      method: 'GET',
      headers: authHeaders(token ?? undefined),
    })

    const courses: Course[] = (rawCourses || []).map((c: any) => {
      const modules = (c.modules || []).map((m: any) => ({
        ...m,
        orderIndex: m.order_index ?? m.orderIndex,
        iconEmoji: m.icon_emoji ?? m.iconEmoji,
        lessons: (m.lessons || []).map((l: any) => ({
          ...l,
          lessonType: l.lesson_type ?? l.lessonType,
          orderIndex: l.order_index ?? l.orderIndex,
          xpReward: l.xpReward ?? l.xp_reward ?? 10,
          estimatedMinutes: l.estimated_minutes ?? l.estimatedMinutes,
          isLocked: l.is_locked ?? l.isLocked,
        })),
      }))

      return {
        id: c.id,
        title: c.title,
        description: c.description,
        difficulty: c.difficulty,
        language: c.language,
        modules,
        color: c.color,
        iconUrl: c.icon_url ?? c.iconUrl,
        estimatedHours: c.estimated_hours ?? c.estimatedHours,
        isPublished: c.is_published ?? c.isPublished ?? false,
      } as Course
    })

    this.cache.clear()
    courses.forEach((course) => this.cache.set(course.id, course))

    return courses
  }

  async getLessonById(lessonId: string): Promise<Lesson | null> {
    const token = this.getTokenOrThrow()
    const lesson = await apiFetch<Lesson>(`/lessons/${encodeURIComponent(lessonId)}`, {
      method: 'GET',
      headers: authHeaders(token),
    })
    return lesson
  }

  async createCourse(courseData: CreateCourseDTO): Promise<Course> {
    const token = this.getTokenOrThrow()
    return apiFetch<Course>(`/courses`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        title: courseData.title,
        description: courseData.description,
        difficulty: courseData.difficulty,
        language: courseData.language,
        color: courseData.color,
        orderIndex: 0,
        isPublished: courseData.isPublished,
        estimatedHours: courseData.estimatedHours,
        iconUrl: courseData.iconUrl,
      }),
    })
  }

  async createModule(moduleData: CreateModuleDTO): Promise<Module> {
    const token = this.getTokenOrThrow()
    return apiFetch<Module>(`/modules`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        course_id: moduleData.course_id,
        title: moduleData.title,
        description: moduleData.description,
        orderIndex: moduleData.orderIndex,
        iconEmoji: moduleData.iconEmoji,
      }),
    })
  }

  async createLesson(lessonData: CreateLessonDTO): Promise<void> {
    const token = this.getTokenOrThrow()
    await apiFetch(`/lessons`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        module_id: lessonData.module_id,
        title: lessonData.title,
        lessonType: lessonData.lessonType,
        content: lessonData.content,
        xpReward: lessonData.xpReward,
        orderIndex: lessonData.orderIndex ?? 0,
        isLocked: lessonData.isLocked ?? false,
        description: lessonData.description,
        language: lessonData.language,
        estimatedMinutes: lessonData.estimatedMinutes,
      }),
    })
  }

  async updateLesson(
    lessonId: string,
    updates: {
      title?: string
      description?: string
      lessonType?: LessonType
      content?: LessonContent
      language?: Language
      xpReward?: number
      orderIndex?: number
      isLocked?: boolean
      estimatedMinutes?: number
    }
  ): Promise<Lesson> {
    const token = this.getTokenOrThrow()
    return apiFetch<Lesson>(`/lessons/${encodeURIComponent(lessonId)}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ updates }),
    })
  }

  async updateCourse(
    courseId: string,
    updates: {
      title?: string
      description?: string
      difficulty?: Difficulty
      language?: string
      color?: string
      isPublished?: boolean
      estimatedHours?: number
      iconUrl?: string
    }
  ): Promise<Course> {
    const token = this.getTokenOrThrow()
    return apiFetch<Course>(`/courses/${encodeURIComponent(courseId)}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ updates }),
    })
  }

  async updateModule(
    moduleId: string,
    updates: {
      title?: string
      description?: string
      orderIndex?: number
      iconEmoji?: string
    }
  ): Promise<Module> {
    const token = this.getTokenOrThrow()
    return apiFetch<Module>(`/modules/${encodeURIComponent(moduleId)}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ updates }),
    })
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const token = this.getTokenOrThrow()
    await apiFetch(`/lessons/${encodeURIComponent(lessonId)}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })
  }

  async deleteModule(moduleId: string): Promise<void> {
    const token = this.getTokenOrThrow()
    await apiFetch(`/modules/${encodeURIComponent(moduleId)}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })
  }

  async deleteCourse(courseId: string): Promise<void> {
    const token = this.getTokenOrThrow()
    await apiFetch(`/courses/${encodeURIComponent(courseId)}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  }

  private getTokenOrThrow(): string {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('Not authenticated - access token missing')
    }
    return token
  }
}

export const lessonService = new LessonService()
