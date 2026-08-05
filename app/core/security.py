from itsdangerous import URLSafeSerializer, BadSignature
from passlib.context import CryptContext
from app.core.config import SECRET_KEY

# 1. Setup Password Hashing Context
# This uses bcrypt to hash passwords securely
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 2. Setup itsdangerous Serializer
# This uses your SECRET_KEY to sign and unsign data
serializer = URLSafeSerializer(SECRET_KEY)

# --- Password Utilities ---

def hash_password(password: str) -> str:
    """
    Hashes a plain-text password using bcrypt.
    Use this when seeding or creating an admin user.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain-text password against a hashed password.
    Use this during login.
    """
    return pwd_context.verify(plain_password, hashed_password)

# --- Session Token Utilities ---

def generate_session_token(payload: dict) -> str:
    """
    Serializes a dictionary (e.g., {"admin_id": 1}) and signs it.
    The resulting string is safe to store in a browser cookie.
    """
    return serializer.dumps(payload)

def verify_session_token(token: str) -> dict | None:
    """
    Verifies the signature of the token and deserializes it back to a dictionary.
    Returns the dictionary if valid, or None if the token has been tampered with or is invalid.
    """
    try:
        return serializer.loads(token)
    except BadSignature:
        return None
