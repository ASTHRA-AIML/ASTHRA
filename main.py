from fastapi import FastAPI
from app.routes import app_router
import app.models

app=FastAPI(title="ASTHRA Backend API", version="0.0.1")

app.include_router(app_router)