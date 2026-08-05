from dotenv import load_dotenv
import os
load_dotenv()

DATABASE_URL=os.getenv("DATABASE_URL")
ADMIN_SEED_USERNAME=os.getenv("ADMIN_SEED_USERNAME")
ADMIN_SEED_PASSWORD=os.getenv("ADMIN_SEED_PASSWORD")
CLOUDINARY_CLOUD_NAME=os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY=os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET=os.getenv("CLOUDINARY_API_SECRET")
SECRET_KEY=os.getenv("SECRET_KEY")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not found.")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not found.")