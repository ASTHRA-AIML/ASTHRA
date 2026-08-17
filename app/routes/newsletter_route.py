from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.controllers.public.newsletter_controller import get_all_newsletters_controller,get_newsletter_controller
from app.schemas.newsletter_schema import newsletterpageResponse,newsletterResponse

router=APIRouter()

@router.get("/newsletters",response_model=list[newsletterResponse])
async def get_all_newsletters(db:Session=Depends(get_db),sort_by:str="id"):
    return await get_all_newsletters_controller(db,sort_by)

@router.get("/newsletters/{newsletter_id}",response_model=newsletterpageResponse)
async def get_newsletter(db:Session=Depends(get_db),newsletter_id:int=None):
    return await get_newsletter_controller(db,newsletter_id)

