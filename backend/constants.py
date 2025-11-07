"""
Application constants and configuration values.
Centralized location for magic numbers and repeated values.
"""

# API Configuration
API_VERSION = "1.0.0"
API_TITLE = "Learning Platform API"
API_DESCRIPTION = "Backend API for interactive coding courses"

# Security
MIN_PASSWORD_LENGTH = 8
MIN_USERNAME_LENGTH = 3
MAX_USERNAME_LENGTH = 20
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Validation
MAX_CODE_LENGTH = 10000
MAX_QUERY_LENGTH = 100
MAX_OUTPUT_LENGTH = 1000
DEFAULT_CODE_TIMEOUT = 5  # seconds

# Lesson Configuration
DEFAULT_XP_REWARD = 10
DEFAULT_LESSON_MINUTES = 15

# HTTP Status Messages
MSG_UNAUTHORIZED = "Authentication required"
MSG_FORBIDDEN = "Permission denied"
MSG_NOT_FOUND = "Resource not found"
MSG_CONFLICT = "Resource already exists"
MSG_SERVER_ERROR = "Internal server error"

# Database
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# Roles
ROLE_USER = "user"
ROLE_ADMIN = "admin"
ROLE_SUPER_ADMIN = "super_admin"
ADMIN_ROLES = [ROLE_ADMIN, ROLE_SUPER_ADMIN]

# Difficulty Levels
DIFFICULTY_BEGINNER = "beginner"
DIFFICULTY_INTERMEDIATE = "intermediate"
DIFFICULTY_ADVANCED = "advanced"

# Lesson Types
LESSON_TYPE_THEORY = "theory"
LESSON_TYPE_EXERCISE = "exercise"
LESSON_TYPE_QUIZ = "quiz"
LESSON_TYPE_PROJECT = "project"

# Languages
LANGUAGE_PYTHON = "python"
LANGUAGE_JAVASCRIPT = "javascript"
LANGUAGE_TYPESCRIPT = "typescript"
LANGUAGE_HTML = "html"
LANGUAGE_CSS = "css"
LANGUAGE_JAVA = "java"

SUPPORTED_LANGUAGES = [
    LANGUAGE_PYTHON,
    LANGUAGE_JAVASCRIPT,
    LANGUAGE_TYPESCRIPT,
    LANGUAGE_HTML,
    LANGUAGE_CSS,
    LANGUAGE_JAVA
]
