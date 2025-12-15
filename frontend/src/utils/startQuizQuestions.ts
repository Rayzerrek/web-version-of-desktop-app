import type { OnboardingAnswers } from "../types/onboarding";

const interestOptions = [
    { value: "python", label: "Backend and data science" },
    { value: "javascript/typescript", label: "Web development" },
    { value: "html", label: "Web design" },
    { value: "css", label: "Web design" },
    { value: "not-sure", label: "Not sure yet" },
];

const experienceOptions = [
    { value: "beginner", label: "Nope, I'm a total beginner" },
    { value: "intermediate", label: "I have some experience" },
    { value: "advanced", label: "I'm quite experienced" },
]

const getInterstitialMessage = (answers: OnboardingAnswers) => {
    if(answers.interest === 'python'){
        return "Great choice! Python is a versatile language used in web development, data science, AI, and more. Let's find the perfect course for you."
    }
    if(answers.interest === 'javascript/typescript'){
        return "Awesome! JavaScript and TypeScript are essential for modern web development. We'll help you find a course that matches your interests and skill level."
    }
    if(answers.interest === 'html' || answers.interest === 'css'){
        return "Fantastic! HTML and CSS are the building blocks of web design. We'll guide you to a course that suits your creativity and skill level."
    }
    return "No worries! We'll help you explore different programming paths and find a course that sparks your interest."
}

const getFinalMessage = (answers: OnboardingAnswers) => {
    if(answers.experience === 'beginner'){
        return "As a beginner, you'll start with the basics and gradually build your skills. We recommend starting with our introductory courses to get a solid foundation."
    }
    if(answers.experience === 'intermediate'){
        return "With some experience under your belt, you're ready to take on more challenging topics. We suggest exploring our intermediate courses to enhance your skills."
    }
    return "As an advanced learner, you're ready to dive deep into complex topics. We recommend our advanced courses to help you master your chosen field."
}


export { interestOptions, experienceOptions, getInterstitialMessage, getFinalMessage };