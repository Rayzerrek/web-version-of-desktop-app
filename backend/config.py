"""
Application configuration management using Pydantic Settings.
Loads configuration from environment variables and .env.production file.
"""
from pydantic_settings import BaseSettings
from pydantic import field_validator, Field
from typing import List


class Settings(BaseSettings):
    """
    Application settings with validation.
    
    All settings can be overridden via environment variables.
    """
    # Supabase Configuration
    supabase_url: str = Field(..., description="Supabase project URL")
    supabase_anon_key: str = Field(..., description="Supabase anonymous key")
    supabase_service_key: str = Field(default="", description="Supabase service role key (optional)")
    
    # API Configuration
    backend_url: str = Field(
        default="http://localhost:8000",
        description="Backend"
    )
    cors_origins: str = Field(
        default="http://localhost:5173",
        description="Frontend"
    )
    
    # Server Configuration
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8000, ge=1, le=65535, description="Server port")
    
    # Security
    jwt_secret: str = Field(
        default="change-this-in-production",
        min_length=32,
        description="JWT secret key (min 32 characters)"
    )
    environment: str = Field(
        default="development",
        pattern="^(development|production|testing)$",
        description="Application environment"
    )

    @field_validator('supabase_url')
    @classmethod
    def validate_supabase_url(cls, v: str) -> str:
        """Ensure Supabase URL uses HTTPS protocol"""
        if not v.startswith('https://'):
            raise ValueError("Supabase URL must use HTTPS")
        return v
    
    @field_validator('cors_origins')
    @classmethod
    def validate_cors_origins(cls, v: str) -> str:
        """Prevent wildcard CORS in production"""
        if v == "*":
            raise ValueError("Wildcard CORS (*) not allowed for security reasons")
        return v
    
    @field_validator('jwt_secret')
    @classmethod
    def validate_jwt_secret(cls, v: str) -> str:
        """Warn about default JWT secret"""
        if v == "change-this-in-production":
            import warnings
            warnings.warn(
                "Using default JWT secret! Change this in production!",
                stacklevel=2
            )
        return v
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Get CORS origins as a list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    @property
    def is_production(self) -> bool:
        """Check if running in production environment"""
        return self.environment == "production"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development environment"""
        return self.environment == "development"

    class Config:
        """Pydantic configuration"""
        env_file = ".env.production"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields in .env file


# Global settings instance
settings = Settings()


