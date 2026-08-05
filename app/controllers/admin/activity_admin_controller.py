from sqlalchemy.orm import Session
from app.services.activity_service import get_all_activities,create_activity,update_activity,delete_activity,get_activity
from app.schemas.activity_schema import activityRequest

async def get_all_activity_controller(db:Session,sort_by:str="id"):
    return await get_all_activities(db,sort_by)

async def create_activity_controller(db:Session,activity_data):
    return await create_activity(db,activity_data.model_dump())

async def update_activity_controller(db:Session,activity_id:int,activities:activityRequest):
    return await update_activity(db,activity_id,activities)

async def delete_activity_controller(db:Session,activity_id:int):
    return await delete_activity(db,activity_id)


async def get_activity_controller(db:Session,activity_id:int):
    return await get_activity(db,activity_id)