"""Search and code validation routes"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from models import SearchQuery, SearchResult, CodeValidationRequest, CodeValidationResponse
from supabase_client import get_supabase
from utils import get_access_token, handle_supabase_error
from services import code_executor
from constants import MAX_QUERY_LENGTH


router = APIRouter(tags=["Utilities"])


@router.get("/search", response_model=List[SearchResult])
async def search_content(
    q: str = Query(..., min_length=1, max_length=MAX_QUERY_LENGTH, description="Search query"),
    token: str = Depends(get_access_token)
):
    """Search courses and lessons"""
    try:
        # Validate query using Pydantic
        query_obj = SearchQuery(query=q)
        query = query_obj.query
        
        supabase = get_supabase()
        results = []
        
        # Search courses
        courses_response = supabase.table("courses") \
            .select("id, title, description") \
            .or_(f"title.ilike.%{query}%,description.ilike.%{query}%") \
            .eq("is_published", True) \
            .limit(5) \
            .execute()
        
        for course in courses_response.data:
            results.append(SearchResult(
                type="course",
                id=course["id"],
                title=course["title"],
                description=course.get("description"),
                course_name=None,
                module_name=None
            ))
        
        # Search lessons
        lessons_response = supabase.table("lessons") \
            .select("id, title, description, module_id, modules(title, course_id, courses(title))") \
            .or_(f"title.ilike.%{query}%,description.ilike.%{query}%") \
            .limit(10) \
            .execute()
        
        for lesson in lessons_response.data:
            module_name = None
            course_name = None
            
            if "modules" in lesson and lesson["modules"]:
                module_name = lesson["modules"].get("title")
                if "courses" in lesson["modules"] and lesson["modules"]["courses"]:
                    course_name = lesson["modules"]["courses"].get("title")
            
            results.append(SearchResult(
                type="lesson",
                id=lesson["id"],
                title=lesson["title"],
                description=lesson.get("description"),
                course_name=course_name,
                module_name=module_name
            ))
        
        return results
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        handle_supabase_error(e, "Search failed")


@router.post("/validate_code", response_model=CodeValidationResponse)
async def validate_code(request: CodeValidationRequest):
    """
    Validate and execute user code.
    
    ⚠️ WARNING: This endpoint has security vulnerabilities!
    Should be disabled in production or run in isolated Docker containers.
    """
    try:
        if request.language == "python":
            return await code_executor.validate_python(request.code, request.expected_output)
        elif request.language == "javascript":
            return await code_executor.validate_javascript(request.code, request.expected_output)
        elif request.language == "typescript":
            return await code_executor.validate_typescript(request.code, request.expected_output)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported language: {request.language}"
            )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code execution failed: {str(e)}")
