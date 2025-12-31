import type {
  ExerciseLesson,
  TheoryLesson,
  QuizLesson,
  ProjectLesson,
} from "../types/lesson";

export function createExerciseContent(data: {
  instruction: string;
  starterCode: string;
  solution: string;
  hint?: string;
  exampleCode?: string;
  exampleDescription?: string;
  expectedOutput?: string;
}): ExerciseLesson {
  return {
    type: "exercise",
    instruction: data.instruction,
    starterCode: data.starterCode,
    solution: data.solution,
    hint: data.hint,
    exampleCode: data.exampleCode,
    exampleDescription: data.exampleDescription,
    testCases: data.expectedOutput
      ? [
          {
            expectedOutput: data.expectedOutput,
            description: "Test podstawowy",
          },
        ]
      : undefined,
  };
}

export function createTheoryContent(data: {
  content: string;
  exampleCode?: string;
  exampleDescription?: string;
  examples?: string[];
}): TheoryLesson {
  return {
    type: "theory",
    content: data.content,
    exampleCode: data.exampleCode,
    exampleDescription: data.exampleDescription,
    examples: data.examples,
  };
}

export function createQuizContent(data: {
  question: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
  explanation?: string;
}): QuizLesson {
  return {
    type: "quiz",
    question: data.question,
    options: data.options,
    explanation: data.explanation,
  };
}

export function createProjectContent(data: {
  title: string;
  description: string;
  requirements: string[];
  starterCode?: string;
  hints?: string[];
}): ProjectLesson {
  return {
    type: "project",
    title: data.title,
    description: data.description,
    requirements: data.requirements,
    starterCode: data.starterCode,
    hints: data.hints,
  };
}
