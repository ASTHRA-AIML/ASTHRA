from sqlalchemy.orm import Session
from app.services.newsletter_service import get_newsletter,get_all_newsletters,create_newsletter,update_newsletter,delete_newsletter
from app.schemas.newsletter_schema import newsletterRequest

async def get_all_newsletters_controller(db:Session,sort_by:str="id"):
    return await get_all_newsletters(db,sort_by)

async def get_newsletter_controller(db:Session,newsletter_id:int):
    return await get_newsletter(db,newsletter_id)

async def create_newsletter_controller(db:Session,newsletter_data:newsletterRequest):
    return await create_newsletter(db,newsletter_data.model_dump())

async def update_newsletter_controller(db:Session,newsletter_id:int,newsletter:newsletterRequest):
    return await update_newsletter(db,newsletter_id,newsletter)

async def delete_newsletter_controller(db:Session,newsletter_id:int):
    return await delete_newsletter(db,newsletter_id)