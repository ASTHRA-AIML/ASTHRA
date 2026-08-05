from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.controllers.admin.auth import admin_login_controller, admin_logout_controller
from app.schemas.login_schema import loginRequest

router = APIRouter()


# GET /admin/login — placeholder; the actual login UI is served by the separate frontend
@router.get("/login")
async def login_page():
    return {"message": "Use POST /admin/login with a JSON body to authenticate"}



# POST /admin/login — processes the submitted login form
@router.post("/login")
async def login(user:loginRequest,db: Session = Depends(get_db)):
    return await admin_login_controller(db,user)


# POST /admin/logout — clears the session cookie and redirects to login
@router.post("/logout")
async def logout():
    return await admin_logout_controller()