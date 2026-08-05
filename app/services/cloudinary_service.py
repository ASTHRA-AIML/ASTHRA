import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from app.core.config import (
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
) 

# Configure the Cloudinary SDK once when this module is imported.
# Credentials are read from .env via config.py.
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
)


def upload_file(file: UploadFile, folder: str) -> str:
    """Upload a file (image or PDF) to Cloudinary and return the hosted URL.

    Args:
        file:   A FastAPI UploadFile from a form submission.
        folder: The Cloudinary folder to organise uploads into,
                e.g. "activities", "newsletters", "members".

    Returns:
        The public URL of the uploaded file.

    Raises:
        Exception: Re-raises any Cloudinary upload error so the caller
                   can handle it (e.g. return a 500 to the client).
    """
    try:
        # Determine resource_type: PDFs are "raw", everything else is "image".
        content_type = file.content_type or ""
        resource_type = "raw" if content_type == "application/pdf" else "image"

        result = cloudinary.uploader.upload(
            file.file,                   # the file-like object
            folder=folder,               # e.g. "activities/thumbnails"
            resource_type=resource_type,  # "image" or "raw"
        )
        return result["secure_url"]
    except Exception as e:
        raise Exception(f"Cloudinary upload failed: {e}")
