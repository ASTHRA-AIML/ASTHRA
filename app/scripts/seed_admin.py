from app.core.config import ADMIN_SEED_USERNAME, ADMIN_SEED_PASSWORD
from app.db.session import SessionLocal
from app.models.admin import admins
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_admin():
    # Hash the plain-text password
    hashed_password = pwd_context.hash(ADMIN_SEED_PASSWORD)

    # Create a new admin instance (a row)
    admin = admins(
        username=ADMIN_SEED_USERNAME,
        hashed_password=hashed_password,
    )

    # Open a session, insert the row, and commit
    db = SessionLocal()
    try:
        db.add(admin)
        db.commit()
        print(f"Admin user '{ADMIN_SEED_USERNAME}' seeded successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding admin: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()
