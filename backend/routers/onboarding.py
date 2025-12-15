from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from utils.dependencies import get_current_user
from supabase_client import get_admin_supabase

supabase = get_admin_supabase()
router = APIRouter(prefix="/users", tags=["onboarding"])


class OnboardingAnswers(BaseModel):
    interest: str  # 'python', 'javascript/typescript', 'html', 'css', 'not-sure'
    experience: str  # 'beginner', 'intermediate', 'advanced'


class OnboardingRecommendation(BaseModel):
    coursePath: str
    courseId: str
    message: str


def get_course_recommendation(interest: str, experience: str) -> OnboardingRecommendation:
    
    course_mapping = {
        'python': {
            'beginner': {
                'courseId': 'python-basics-001',
                'coursePath': 'Backend and Data Science Path',
                'message': 'Starting with Python fundamentals - perfect for backend and data science'
            },
            'intermediate': {
                'courseId': 'python-advanced-001',
                'coursePath': 'Backend and Data Science Path',
                'message': 'Jumping into advanced Python concepts and real-world applications'
            },
            'advanced': {
                'courseId': 'python-expert-001',
                'coursePath': 'Backend and Data Science Path',
                'message': 'Expert-level Python, frameworks, and system design'
            }
        },
        'javascript/typescript': {
            'beginner': {
                'courseId': 'js-basics-001',
                'coursePath': 'Web Development Path',
                'message': 'Starting with JavaScript fundamentals for web development'
            },
            'intermediate': {
                'courseId': 'js-advanced-001',
                'coursePath': 'Web Development Path',
                'message': 'Modern JavaScript/TypeScript and popular frameworks'
            },
            'advanced': {
                'courseId': 'fullstack-advanced-001',
                'coursePath': 'Web Development Path',
                'message': 'Advanced full-stack development and architecture'
            }
        },
        'html': {
            'beginner': {
                'courseId': 'html-basics-001',
                'coursePath': 'Web Design Path',
                'message': 'HTML fundamentals - building blocks of the web'
            },
            'intermediate': {
                'courseId': 'html-advanced-001',
                'coursePath': 'Web Design Path',
                'message': 'Semantic HTML, accessibility, and modern best practices'
            },
            'advanced': {
                'courseId': 'webdesign-advanced-001',
                'coursePath': 'Web Design Path',
                'message': 'Advanced web design patterns and optimization'
            }
        },
        'css': {
            'beginner': {
                'courseId': 'css-basics-001',
                'coursePath': 'Web Design Path',
                'message': 'CSS fundamentals - styling your web pages'
            },
            'intermediate': {
                'courseId': 'css-advanced-001',
                'coursePath': 'Web Design Path',
                'message': 'Advanced CSS, animations, and responsive design'
            },
            'advanced': {
                'courseId': 'css-expert-001',
                'coursePath': 'Web Design Path',
                'message': 'CSS architecture, preprocessors, and modern frameworks'
            }
        },
        'not-sure': {
            'beginner': {
                'courseId': 'intro-programming-001',
                'coursePath': 'Exploratory Path',
                'message': 'Introduction to programming - explore different languages'
            },
            'intermediate': {
                'courseId': 'python-basics-001',
                'coursePath': 'Exploratory Path',
                'message': 'Python is versatile - great for exploring options'
            },
            'advanced': {
                'courseId': 'python-basics-001',
                'coursePath': 'Exploratory Path',
                'message': 'Explore different paths to find your passion'
            }
        }
    }
    
    recommendation_data = course_mapping.get(interest, {}).get(
        experience, 
        course_mapping['not-sure']['beginner']
    )
    
    return OnboardingRecommendation(**recommendation_data)


@router.post("/onboarding", response_model=OnboardingRecommendation)
async def submit_onboarding(
    answers: OnboardingAnswers,
    current_user: dict = Depends(get_current_user)
):
    try:
        supabase.table("profiles").update({
            "learning_path": answers.interest,
            "experience_level": answers.experience,
        }).eq("id", current_user["id"]).execute()
        
        recommendation = get_course_recommendation(answers.interest, answers.experience)
        
        return recommendation
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/onboarding/complete")
async def complete_onboarding(
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["id"]
        
        supabase.table("profiles").update({
            "onboarding_completed": True,
        }).eq("id", user_id).execute()
        
        return {"message": "Onboarding completed successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
