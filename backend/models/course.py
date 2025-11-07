from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Literal, Any
from datetime import datetime


# Enums
Difficulty = Literal["beginner", "intermediate", "advanced"]
Language = Literal["python", "javascript", "typescript", "html", "css", "java"]
LessonType = Literal["theory", "exercise", "quiz", "project"]


# Lesson Content Models
class LessonContentBase(BaseModel):
    type: LessonType


class TestCase(BaseModel):
    input: str
    expectedOutput: str
    description: Optional[str] = None


class ExerciseContent(LessonContentBase):
    type: Literal["exercise"] = "exercise"
    instruction: str
    starterCode: str
    solution: str
    hint: Optional[str] = None
    exampleCode: Optional[str] = None
    exampleDescription: Optional[str] = None
    testCases: Optional[List[TestCase]] = None


class TheoryContent(LessonContentBase):
    type: Literal["theory"] = "theory"
    content: str
    examples: Optional[List[str]] = None


class QuizOption(BaseModel):
    text: str
    isCorrect: bool


class QuizContent(LessonContentBase):
    type: Literal["quiz"] = "quiz"
    question: str
    options: List[QuizOption]
    explanation: Optional[str] = None


class ProjectContent(LessonContentBase):
    type: Literal["project"] = "project"
    description: str
    requirements: List[str]
    starterCode: Optional[str] = None
    hints: Optional[List[str]] = None


# Lesson Models
class LessonBase(BaseModel):
    title: str
    description: str
    lessonType: LessonType
    language: Language
    orderIndex: int
    xpReward: int = 10
    estimatedMinutes: int = 15
    isLocked: bool = False


class LessonCreate(LessonBase):
    module_id: str
    content: ExerciseContent | TheoryContent | QuizContent | ProjectContent


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    lessonType: Optional[LessonType] = None
    content: Optional[Any] = None
    language: Optional[Language] = None
    xpReward: Optional[int] = None
    orderIndex: Optional[int] = None
    isLocked: Optional[bool] = None
    estimatedMinutes: Optional[int] = None


class LessonResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    
    id: str
    module_id: str
    title: str
    description: str
    lessonType: LessonType = Field(validation_alias='lesson_type')
    language: Language
    orderIndex: int = Field(validation_alias='order_index')
    xpReward: int = Field(default=10, validation_alias='xp_reward')
    estimatedMinutes: int = Field(default=15, validation_alias='estimated_minutes')
    isLocked: bool = Field(default=False, validation_alias='is_locked')
    content: Any
    created_at: datetime
    updated_at: Optional[datetime] = None


# Module Models
class ModuleBase(BaseModel):
    title: str
    description: str
    orderIndex: int
    iconEmoji: Optional[str] = "📚"


class ModuleCreate(ModuleBase):
    course_id: str


class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    orderIndex: Optional[int] = None
    iconEmoji: Optional[str] = None


class ModuleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    
    id: str
    course_id: str
    title: str
    description: str
    orderIndex: int = Field(validation_alias='order_index')
    iconEmoji: Optional[str] = Field(default="📚", validation_alias='icon_emoji')
    lessons: List[LessonResponse] = []
    created_at: datetime


# Course Models
class CourseBase(BaseModel):
    title: str
    description: str
    difficulty: Difficulty
    language: str
    color: Optional[str] = "#3B82F6"
    iconUrl: Optional[str] = None
    estimatedHours: Optional[int] = 10
    isPublished: bool = False


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    language: Optional[str] = None
    color: Optional[str] = None
    isPublished: Optional[bool] = None
    estimatedHours: Optional[int] = None
    iconUrl: Optional[str] = None


class CourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    
    id: str
    title: str
    description: str
    difficulty: Difficulty
    language: str
    color: Optional[str] = "#3B82F6"
    iconUrl: Optional[str] = Field(default=None, validation_alias='icon_url')
    estimatedHours: Optional[int] = Field(default=10, validation_alias='estimated_hours')
    isPublished: bool = Field(default=False, validation_alias='is_published')
    modules: List[ModuleResponse] = []
    created_at: datetime
