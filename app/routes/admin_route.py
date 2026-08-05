from fastapi import APIRouter,Depends,UploadFile,File,Form
from app.core.dependencies import require_admin
from app.controllers.admin.activity_admin_controller import get_all_activity_controller,create_activity_controller,update_activity_controller,delete_activity_controller,get_activity_controller
from app.schemas.activity_schema import activityRequest,activityResponse,activitypageResponse
from app.controllers.admin.newsletter_admin_controller import get_all_newsletters_controller,get_newsletter_controller,create_newsletter_controller,update_newsletter_controller,delete_newsletter_controller
from app.schemas.newsletter_schema import newsletterRequest,newsletterResponse,newsletterpageResponse
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.services.cloudinary_service import upload_file

router=APIRouter()

@router.get("/activities",response_model=list[activityResponse])
async def get_all_activities(db:Session=Depends(get_db),sort_by:str="id"):
    return await get_all_activity_controller(db,sort_by)

@router.get("/activities/{activity_id}",response_model=activitypageResponse)
async def get_activity(db:Session=Depends(get_db),activity_id:int=None):
    return await get_activity_controller(db,activity_id)


@router.post("/activities")
async def create_activity(activity_request:activityRequest,db:Session=Depends(get_db),current_user:str=Depends(require_admin)):
    return await create_activity_controller(db,activity_request)

@router.put("/activities/{activity_id}")
async def update_activity(activity:activityRequest,db:Session=Depends(get_db),activity_id:int=None,current_user:str=Depends(require_admin)):
    return await update_activity_controller(db,activity_id,activity)

@router.delete("/activities/{activity_id}")
async def delete_activity(db:Session=Depends(get_db),activity_id:int=None,current_user:str=Depends(require_admin)):
    return await delete_activity_controller(db,activity_id)

@router.get("/newsletters",response_model=list[newsletterResponse])
async def get_all_newsletters(db:Session=Depends(get_db),sort_by:str="id"):
    return await get_all_newsletters_controller(db,sort_by)

@router.get("/newsletters/{newsletter_id}",response_model=newsletterpageResponse)
async def get_newsletter(db:Session=Depends(get_db),newsletter_id:int=None,current_user:str=Depends(require_admin)):
    return await get_newsletter_controller(db,newsletter_id)

@router.post("/newsletters")
async def create_newsletter(newsletter_request:newsletterRequest,db:Session=Depends(get_db),current_user:str=Depends(require_admin)):
    return await create_newsletter_controller(db,newsletter_request)

@router.put("/newsletters/{newsletter_id}")
async def update_newsletter(newsletter:newsletterRequest,db:Session=Depends(get_db),newsletter_id:int=None,current_user:str=Depends(require_admin)):
    return await update_newsletter_controller(db,newsletter_id,newsletter)

@router.delete("/newsletters/{newsletter_id}")
async def delete_newsletter(db:Session=Depends(get_db),newsletter_id:int=None,current_user:str=Depends(require_admin)):
    return await delete_newsletter_controller(db,newsletter_id)

@router.post("/upload")
async def upload_media(
    file: UploadFile = File(...),
    folder: str = Form(...),
    current_user: str = Depends(require_admin)
):
    url = upload_file(file, folder)
    return {"url": url}
