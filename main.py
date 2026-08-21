from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import app_router
import app.models

app = FastAPI(title="ASTHRA Backend API", version="0.0.1")

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
        "null",
    ],
    allow_credentials=True,            # needed for admin_session cookie
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(app_router)