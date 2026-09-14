"""
ASTHRA Backend Application
--------------------------
Author: SANKAR KRISHNA <sankarkrishnapthenur124@gmail.com>
GitHub: https://github.com/SANKAR-124
Created: September 2026
Department: Artificial Intelligence & Machine Learning
"""

__author__ = "SANKAR KRISHNA"
__email__ = "sankarkrishnapthenur124@gmail.com"
__version__ = "0.0.1"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import app_router
import app.models

app = FastAPI(
    title="ASTHRA Backend API",
    description="Official Backend API for ASTHRA — Department of Artificial Intelligence & Machine Learning",
    version=__version__,
    contact={
        "name": "SANKAR KRISHNA",
        "email": "sankarkrishnapthenur124@gmail.com",
        "url": "https://github.com/SANKAR-124",
    },
)

# CORS — must list exact origins (no wildcard) when credentials=True.
# Public demo frontend is served via Live Server or direct file:// open —
# neither sends cookies, so it only needs its origin whitelisted.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",        # Admin frontend (Vite default)
        "http://127.0.0.1:5173",
        "http://localhost:5174",        # Admin frontend (Vite alternate port)
        "http://127.0.0.1:5174",
        "http://localhost:5500",        # Live Server
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "https://asthra-snowy.vercel.app",
        "null",
    ],
    allow_credentials=True,            # needed for admin_session cookie
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(app_router)
