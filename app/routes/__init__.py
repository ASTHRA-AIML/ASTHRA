from fastapi import APIRouter
from app.routes.activity_route import router as activity_router
from app.routes.login_route import router as login_router
from app.routes.admin_route import router as admin_router
from app.routes.committee_route import router as committee_router
from app.routes.newsletter_route import router as newsletter_router

app_router=APIRouter()

app_router.include_router(activity_router,prefix="/asthra",tags=["activities"])
app_router.include_router(login_router,prefix="/admin",tags=["Authentication"])
app_router.include_router(admin_router,prefix="/asthra/admin",tags=["Admin"])
app_router.include_router(committee_router,prefix="/asthra",tags=["committee"])
app_router.include_router(newsletter_router,prefix="/asthra",tags=["newsletter"])