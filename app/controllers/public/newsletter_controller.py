from sqlalchemy.orm import Session
from app.services.newsletter_service import get_all_newsletters,get_newsletter

async def get_all_newsletters_controller(db:Session,sort_by:str="id"):
    return await get_all_newsletters(db,sort_by)

async def get_newsletter_controller(db:Session,newsletter_id:int):
    return await get_newsletter(db,newsletter_id)
