import { apiFetch, authHeaders } from './ApiClient'

export type RequirementType = 'streak' | 'xp' | 'lessons_completed' | 'course_completed'

export interface Achievement {
    id: string
    title: string
    description?: string
    icon_url?: string
    requirement_type: RequirementType
    requirement_value: number
    badge_color: string
}

export class AchievementService {
    async getAvailableAchievements(): Promise<Achievement[]> {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No access token')

        return await apiFetch<Achievement[]>('/achievements', {
            headers: authHeaders(token),
        })
    }

    async getUserAchievements(userId: string): Promise<Achievement[]> {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No access token')

        return await apiFetch<Achievement[]>(`/achievements/users/${userId}`, {
            headers: authHeaders(token),
        })
    }

    async checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No access token')

        const response = await apiFetch<{ newly_unlocked: Achievement[], total_unlocked: number }>(
            `/achievements/users/${userId}/check`,
            {
                method: 'POST',
                headers: authHeaders(token),
            }
        )

        return response.newly_unlocked || []
    }
}

export const achievementService = new AchievementService()
