from sqlalchemy.orm import Session, joinedload
from app.models.member import members
from app.models.membership import memberships
from datetime import datetime
from app.schemas.committee_schema import memberRequest,addmembershipRequest, allmembersResponse, currentcommitteeResponse
from fastapi import HTTPException


async def current_committee(db:Session,date:str):
    try:
        parsed_date = datetime.strptime(date, "%Y-%m-%d")
    except (ValueError, TypeError):
        parsed_date = datetime.utcnow()
        
    year = parsed_date.year
    month = parsed_date.month
    
    if month >= 6:
        academic_year_str = f"{year}-{str(year + 1)[2:]}"
    else:
        academic_year_str = f"{year - 1}-{str(year)[2:]}"
        
    committee_memberships = (
        db.query(memberships)
        .options(joinedload(memberships.member))
        .filter(memberships.acadamic_year == academic_year_str)
        .all()
    )
    
    # Fallback: If no committee members are found for the current calculated year,
    # show the members from the latest available academic year.
    if not committee_memberships:
        latest_year_row = (
            db.query(memberships.acadamic_year)
            .order_by(memberships.acadamic_year.desc())
            .first()
        )
        if latest_year_row:
            latest_year_str = latest_year_row[0]
            committee_memberships = (
                db.query(memberships)
                .options(joinedload(memberships.member))
                .filter(memberships.acadamic_year == latest_year_str)
                .all()
            )
            
    # Format to match currentcommitteeResponse schema fields
    result = []
    for m in committee_memberships:
        if m.member:
            result.append({
                "id": m.member.id,
                "name": m.member.name,
                "photo_url": m.member.photo_url,
                "position": m.position,
                "linkedin_url": m.member.linkedin_url,
                "acadamic_year": m.acadamic_year
            })
    return result


async def get_all_committee(db: Session):
    # Sort by academic year ascending: oldest academic year first
    committee_list = (
        db.query(memberships)
        .options(joinedload(memberships.member))
        .order_by(memberships.acadamic_year.asc())
        .all()
    )
    
    result = []
    for m in committee_list:
        if m.member:
            result.append({
                "id": m.member.id,
                "name": m.member.name,
                "photo_url": m.member.photo_url,
                "position": m.position,
                "linkedin_url": m.member.linkedin_url,
                "acadamic_year": m.acadamic_year
            })
    return result


async def get_all_members(db: Session):
    return db.query(members).options(joinedload(members.memberships)).all()


async def get_member(db: Session, member_id: int):
    member_record = (
        db.query(members)
        .options(joinedload(members.memberships))
        .filter(members.id == member_id)
        .first()
    )
    if not member_record:
        raise HTTPException(status_code=404, detail="Member not found.")
    return member_record


async def create_member(db: Session, member_data: memberRequest):
    new_member = members(
        name=member_data.name,
        photo_url=member_data.photo_url,
        linkedin_url=member_data.linkedin_url
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    
    new_membership = memberships(
        member_id=new_member.id,
        acadamic_year=member_data.acadamic_year,
        position=member_data.position
    )
    db.add(new_membership)
    db.commit()
    db.refresh(new_membership)
    
    return {
        "id": new_member.id,
        "name": new_member.name,
        "photo_url": new_member.photo_url,
        "position": new_membership.position,
        "linkedin_url": new_member.linkedin_url,
        "acadamic_year": new_membership.acadamic_year
    }


async def update_member(db: Session, member_id: int, member_data: memberRequest):
    member_record = db.query(members).filter(members.id == member_id).first()
    if not member_record:
        raise HTTPException(status_code=404, detail="Member not found.")
        
    member_record.name = member_data.name
    member_record.photo_url = member_data.photo_url
    member_record.linkedin_url = member_data.linkedin_url
    
    # Check if a membership exists for this academic year
    membership_record = (
        db.query(memberships)
        .filter(memberships.member_id == member_id, memberships.acadamic_year == member_data.acadamic_year)
        .first()
    )
    
    if membership_record:
        membership_record.position = member_data.position
    else:
        membership_record = memberships(
            member_id=member_id,
            acadamic_year=member_data.acadamic_year,
            position=member_data.position
        )
        db.add(membership_record)
        
    db.commit()
    db.refresh(member_record)
    db.refresh(membership_record)
    
    return {
        "id": member_record.id,
        "name": member_record.name,
        "photo_url": member_record.photo_url,
        "position": membership_record.position,
        "linkedin_url": member_record.linkedin_url,
        "acadamic_year": membership_record.acadamic_year
    }


async def delete_member(db: Session, member_id: int):
    member_record = db.query(members).filter(members.id == member_id).first()
    if not member_record:
        raise HTTPException(status_code=404, detail="Member not found.")
    db.delete(member_record)
    db.commit()
    return {"message": "Member deleted successfully."}


async def delete_committee_by_year(db: Session, academic_year: str):
    deleted_count = db.query(memberships).filter(memberships.acadamic_year == academic_year).delete()
    db.commit()
    return {"message": f"Successfully deleted committee for academic year {academic_year} ({deleted_count} memberships removed)."}


async def add_membership_to_member(db: Session, member_id: int, membership_data: addmembershipRequest):
    member_record = db.query(members).filter(members.id == member_id).first()
    if not member_record:
        raise HTTPException(status_code=404, detail="Member not found.")
        
    existing = db.query(memberships).filter(memberships.member_id == member_id, memberships.acadamic_year == membership_data.acadamic_year).first()
    if existing:
        existing.position = membership_data.position
        new_membership = existing
    else:
        new_membership = memberships(
            member_id=member_id,
            acadamic_year=membership_data.acadamic_year,
            position=membership_data.position
        )
        db.add(new_membership)
        
    db.commit()
    db.refresh(new_membership)
    return new_membership


async def delete_membership_by_id(db: Session, membership_id: int):
    membership_record = db.query(memberships).filter(memberships.id == membership_id).first()
    if not membership_record:
        raise HTTPException(status_code=404, detail="Membership record not found.")
    db.delete(membership_record)
    db.commit()
    return {"message": "Membership deleted successfully."}