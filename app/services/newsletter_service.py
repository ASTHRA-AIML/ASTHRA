from sqlalchemy import desc
from sqlalchemy.orm import Session
from app.models.newsletter import newsletters
from fastapi import HTTPException
from app.schemas.newsletter_schema import newsletterRequest

async def get_all_newsletters(db:Session,sort_by:str="id"):
    query=db.query(newsletters)
    sort_column=getattr(newsletters,sort_by,newsletters.id)
    results=(query.order_by(desc(sort_column)).all())
    return results

async def get_newsletter(db:Session,newsletter_id:int):
    query=db.query(newsletters).filter(newsletters.id==newsletter_id).first()
    if query is None:
        raise HTTPException(status_code=404,detail="newsletter not found.")
    return query

async def create_newsletter(db:Session,newsletter_data:dict):
    new_newsletter=newsletters(**newsletter_data)
    db.add(new_newsletter)
    db.commit()
    db.refresh(new_newsletter)
    return new_newsletter

async def update_newsletter(db:Session,newsletter_id:int,newsletter:newsletterRequest):
    newsletter_record=db.query(newsletters).filter(newsletters.id==newsletter_id).first()
    if not newsletter_record:
        raise HTTPException(
            status_code=404,
            detail="newsletter not found."
        )
    newsletter_record.title=newsletter.title
    newsletter_record.cover_image_url=newsletter.cover_image_url
    newsletter_record.newsletter_date=newsletter.newsletter_date
    newsletter_record.description=newsletter.description
    newsletter_record.pdf_url=newsletter.pdf_url
    db.commit()
    db.refresh(newsletter_record)
    return {
        "message":"Newsletter updated successfully.",
        "newsletter":newsletter_record
    }

async def delete_newsletter(db:Session,newsletter_id:int):
    query=db.query(newsletters).filter(newsletters.id==newsletter_id).first()
    if not query:
        raise HTTPException(
            status_code=404,
            detail="newsletter not found."
        )
    db.delete(query)
    db.commit()
    return {
        "message":"newsletter deleted successfully."
    }
