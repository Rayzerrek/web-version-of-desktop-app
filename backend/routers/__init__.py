"""Routers package"""
from .auth import router as auth_router
from .courses import router as courses_router
from .modules import router as modules_router
from .lessons import router as lessons_router
from .progress import router as progress_router
from .search import router as search_router
from .users import router as users_router
from .achievements import router as achievements_router

__all__ = [
    "auth_router",
    "courses_router",
    "modules_router",
    "lessons_router",
    "progress_router",
    "search_router",
    "users_router",
    "achievements_router",
]

