from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.controllers.public.activity_controller import get_activity_controller
from app.controllers.admin.activity_admin_controller import get_all_activity_controller
from app.schemas.activity_schema import activityResponse,activitypageResponse


router=APIRouter()

@router.get("/activities",response_model=list[activityResponse])
async def get_all_activities(db:Session=Depends(get_db),sort_by:str="id"):
    return await get_all_activity_controller(db,sort_by)

@router.get("/activities/{activity_id}",response_model=activitypageResponse)
async def get_activity(db:Session=Depends(get_db),activity_id:int=None):
    return await get_activity_controller(db,activity_id)
