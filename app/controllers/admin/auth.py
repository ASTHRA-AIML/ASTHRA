from sqlalchemy.orm import Session
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from app.core.security import verify_password, generate_session_token
from app.models.admin import admins
from app.schemas.login_schema import loginRequest


async def admin_login_controller(db: Session, user: loginRequest):
    # Step 1: Find the admin by username in the database
    admin = db.query(admins).filter(admins.username == user.username).first()

    # Step 2: If admin not found or password is wrong, return 401
    if not admin or not verify_password(user.password, admin.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Step 3: Password is correct — generate a signed session token
    token = generate_session_token({"admin_id": admin.id})

    # Step 4: Return JSON response and attach the session cookie
    # samesite="none", secure=True is required for cross-origin cookies between Vercel and Cloudflare Tunnel
    response = JSONResponse(content={"message": "Login successful"}, status_code=200)
    response.set_cookie(
        key="admin_session",
        value=token,
        httponly=True,
        samesite="none",
        secure=True
    )
    return response


async def admin_logout_controller():
    # Clear the session cookie and return a JSON confirmation
    response = JSONResponse(content={"message": "Logged out successfully"}, status_code=200)
    response.delete_cookie(
        key="admin_session",
        samesite="none",
        secure=True
    )
    return response
