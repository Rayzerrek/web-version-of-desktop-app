"""Module management routes"""
from fastapi import APIRouter, Depends, HTTPException
from models import ModuleCreate, ModuleUpdate, ModuleResponse
from supabase_client import get_admin_supabase
from utils import require_admin, handle_supabase_error, convert_dict_keys_to_snake


router = APIRouter(prefix="/modules", tags=["Modules"])


@router.post("", response_model=ModuleResponse)
async def create_module(
    module: ModuleCreate,
    user = Depends(require_admin)
):
    try:
        supabase = get_admin_supabase()
        # Convert camelCase to snake_case for database
        module_data = convert_dict_keys_to_snake(module.model_dump())
        response = supabase.table("modules").insert(module_data).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create module")
        
        result = response.data[0]
        result["lessons"] = []
        return result
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to create module")


@router.put("/{module_id}", response_model=ModuleResponse)
async def update_module(
    module_id: str,
    updates: ModuleUpdate,
    user = Depends(require_admin)
):
    try:
        supabase = get_admin_supabase()
        # Convert camelCase to snake_case for database
        raw_data = {k: v for k, v in updates.model_dump().items() if v is not None}
        update_data = convert_dict_keys_to_snake(raw_data)
        
        response = supabase.table("modules") \
            .update(update_data) \
            .eq("id", module_id) \
            .execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Module not found")
        
        full_response = supabase.table("modules") \
            .select("*, lessons(*)") \
            .eq("id", module_id) \
            .execute()
        
        return full_response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        handle_supabase_error(e, "Failed to update module")


@router.delete("/{module_id}")
async def delete_module(
    module_id: str,
    user = Depends(require_admin)
):
    try:
        supabase = get_admin_supabase()
        supabase.table("modules").delete().eq("id", module_id).execute()
        return {"success": True, "message": "Module deleted"}
    except Exception as e:
        handle_supabase_error(e, "Failed to delete module")
