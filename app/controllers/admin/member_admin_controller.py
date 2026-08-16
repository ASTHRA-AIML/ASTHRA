from sqlalchemy.orm import Session
from app.schemas.committee_schema import memberRequest,addmembershipRequest
from app.services.member_service import get_all_members,create_member,get_member,update_member,delete_member,add_membership_to_member,delete_membership_by_id

async def get_all_members_controller(db:Session):
    return await get_all_members(db)

async def create_member_controller(db:Session,member_data:memberRequest):
    return await create_member(db,member_data)

async def get_member_controller(db:Session,member_id:int):
    return await get_member(db,member_id)

async def update_member_controller(db:Session,member_id:int,member_data:memberRequest):
    return await update_member(db,member_id,member_data)

async def delete_member_controller(db:Session,member_id:int):
    return await delete_member(db,member_id)

async def add_membership_to_member_controller(db:Session,member_id:int,membership_data:addmembershipRequest):
    return await add_membership_to_member(db,member_id,membership_data)

async def delete_membership_by_id_controller(db:Session,membership_id:int):
    return await delete_membership_by_id(db,membership_id)