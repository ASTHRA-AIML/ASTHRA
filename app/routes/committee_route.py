from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.controllers.public.committee_controller import current_committee_controller, get_all_committee_controller
from app.schemas.committee_schema import currentcommitteeResponse, allcommitteeResponse

router = APIRouter()

@router.get("/committee", response_model=list[allcommitteeResponse])
async def get_all_committee(db: Session = Depends(get_db)):
    return await get_all_committee_controller(db)

@router.get("/committee/current", response_model=list[currentcommitteeResponse])
async def get_current_committee(date: str = None, db: Session = Depends(get_db)):
    return await current_committee_controller(db, date)
