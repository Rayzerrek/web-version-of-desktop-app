from pydantic import BaseModel, field_validator, Field
from typing import Optional, Literal


class CodeValidationRequest(BaseModel):
    model_config = {"populate_by_name": True}
    
    code: str = Field(..., max_length=10000, description="Code to validate")
    language: Literal["python", "javascript", "typescript", "html", "css"]
    expected_output: str = Field(..., max_length=1000, alias="expectedOutput")
    
    @field_validator('code')
    def validate_code(cls, v):
        if not v or not v.strip():
            raise ValueError('Code cannot be empty')
        if len(v) > 10000:
            raise ValueError('Code exceeds maximum length of 10000 characters')
        return v.strip()


class CodeValidationResponse(BaseModel):
    success: bool
    output: str
    error: Optional[str] = None
    is_correct: bool


class SearchQuery(BaseModel):
    query: str = Field(..., min_length=1, max_length=100)
    
    @field_validator('query')
    def validate_query(cls, v):
        if not v or not v.strip():
            raise ValueError('Query cannot be empty')
        
        v = v.strip()
        
        
        if len(v) > 100:
            raise ValueError('Query too long (max 100 characters)')
        
        dangerous_patterns = [';', '--', '/*', '*/', 'DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER']
        lower_query = v.lower()
        for pattern in dangerous_patterns:
            if pattern.lower() in lower_query:
                raise ValueError(f'Query contains forbidden pattern: {pattern}')
        
        return v


class SearchResult(BaseModel):
    type: Literal["course", "lesson"]
    id: str
    title: str
    description: Optional[str] = None
    course_name: Optional[str] = None
    module_name: Optional[str] = None
