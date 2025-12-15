import type { Difficulty } from "./lesson";

interface OnboardingAnswers {
    interest: 'python' | 'javascript/typescript' | 'html' | 'css' | 'not-sure' | null;
    experience: Difficulty | null;
}
interface OnboardingRecommendation {
    coursePath: string;
    courseId: string;
    message:string;
}

export type {OnboardingAnswers, OnboardingRecommendation};
