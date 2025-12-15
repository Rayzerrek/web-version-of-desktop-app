"""
Learning Platform API
Version: 1.0.0

A FastAPI-based backend for an interactive learning platform.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import time
import logging

from config import settings
from constants import API_VERSION, API_TITLE
from routers import (
    auth_router,
    courses_router,
    modules_router,
    lessons_router,
    progress_router,
    search_router,
    users_router,
    achievements_router
)
from routers.onboarding import router as onboarding_router
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Backend: {settings.backend_url}")
    logger.info(f"Frontend: {settings.cors_origins}")
    
    yield
    
    logger.info(f"Shutting down {API_TITLE}...")


app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description="Backend API for interactive coding courses",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)



# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    
    if settings.environment == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors"""
    logger.error(
        f"Unhandled exception: {str(exc)}",
        exc_info=True,
        extra={
            "path": request.url.path,
            "method": request.method
        }
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "detail": str(exc) if settings.environment == "development" else None
        }
    )



app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(modules_router)
app.include_router(lessons_router)
app.include_router(progress_router)
app.include_router(search_router)
app.include_router(users_router)
app.include_router(achievements_router)
app.include_router(onboarding_router)


@app.get("/")
async def root():
    """API information endpoint"""
    return {
        "name": API_TITLE,
        "version": API_VERSION,
        "status": "running",
        "environment": settings.environment,
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": API_VERSION
    }


@app.get("/api/info")
async def api_info():
    return {
        "version": "1.0.0",
        "endpoints": {
            "auth": "/auth",
            "courses": "/courses",
            "modules": "/modules",
            "lessons": "/lessons",
            "progress": "/progress",
            "search": "/search",
            "validate_code": "/validate_code"
        },
        "features": [
            "User authentication",
            "Course management",
            "Progress tracking",
            "Code validation",
            "Search functionality"
        ]
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.environment == "development"
    )
