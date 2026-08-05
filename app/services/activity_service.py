from sqlalchemy import desc
from sqlalchemy.orm import Session
from app.models.activity import activities
from app.models.activity_image import activity_images
from fastapi import Depends,HTTPException
from app.schemas.activity_schema import activityRequest

async def get_all_activities(db:Session,sort_by:str="id"):
    query=db.query(activities)
    sort_column=getattr(activities,sort_by,activities.id)
    activity=(query.order_by(desc(sort_column)).all())
    return activity


async def create_activity(db:Session,activity_data:dict):
    # Extract additional image URLs
    image_urls = activity_data.pop("image_url", [])
    
    # Create the activity
    new_activity=activities(**activity_data)
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    
    # Add additional images to the database
    for url in image_urls:
        new_img = activity_images(activity_id=new_activity.id, image_url=url)
        db.add(new_img)
    db.commit()
    db.refresh(new_activity)
    return new_activity

async def update_activity(db:Session,activity_id:int,activity_data:activityRequest):
    # Find the activity record
    activity_record = db.query(activities).filter(activities.id==activity_id).first()
    if not activity_record:
        raise HTTPException(
            status_code=404,
            detail="Activity not found."
        )
        
    # Update basic fields
    activity_record.title = activity_data.title
    activity_record.activity_date = activity_data.activity_date
    activity_record.description = activity_data.description
    activity_record.thumbnail_url = activity_data.thumbnail_url
    
    # Update additional images by recreating them
    db.query(activity_images).filter(activity_images.activity_id==activity_id).delete()
    for url in activity_data.image_url:
        new_img = activity_images(activity_id=activity_id, image_url=url)
        db.add(new_img)
        
    db.commit()
    db.refresh(activity_record)
    return {
        "message":"Activity updated successfully.",
        "activity": activity_record
    }

async def delete_activity(db:Session,activity_id:int):
    query=db.query(activities).filter(activities.id==activity_id).first()
    if(query is None):
        raise HTTPException(
            status_code=404,
            detail="Activity not found"
        )
    db.delete(query)
    db.commit()
    return{
        "message":"Activity deleted successfully."
    }


async def get_activity(db:Session,activity_id:int):
    query=db.query(activities).filter(activities.id==activity_id).first()
    if query is None:
        raise HTTPException(
            status_code=404,
            detail="Activity not found."
        )

    return query



