from app.core.security import verify_session_token
from fastapi import Request, HTTPException


def require_admin(request: Request):
    # Read the "admin_session" cookie from the incoming browser request
    token = request.cookies.get("admin_session")

    # If there is no cookie, the user is not logged in — raise 401 Unauthorized
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Verify the cookie's signature. Returns the payload dict or None if invalid/tampered
    payload = verify_session_token(token)

    # If the token is invalid or was tampered with, raise 401 Unauthorized
    if payload is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # All good — return the payload (e.g. {"admin_id": 1}) to the route
    return payload