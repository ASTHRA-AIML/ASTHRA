from sqlalchemy.orm import Session
from app.services.activity_service import get_all_activities,get_activity

async def get_all_activity_controller(db:Session,sort_by:str="id"):
    return await get_all_activities(db,sort_by)

async def get_activity_controller(db:Session,activity_id:int):
    return await get_activity(db,activity_id)
    