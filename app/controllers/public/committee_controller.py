from sqlalchemy.orm import Session
from app.services.member_service import current_committee,get_all_committee

async def current_committee_controller(db:Session,date:str):
    return await current_committee(db,date)

async def get_all_committee_controller(db:Session):
    return await get_all_committee(db)