from pydantic import BaseModel,Field
from datetime import date

class newsletterResponse(BaseModel):
    id:int
    title:str
    cover_image_url:str

    class Config:
        from_attributes=True


class newsletterpageResponse(BaseModel):
    id:int
    title:str
    cover_image_url:str
    description:str
    newsletter_date:date
    pdf_url:str

    class Config:
        from_attributes=True

class newsletterRequest(BaseModel):
    title:str=Field(...,description="title")
    description:str=Field(...,description="description")
    newsletter_date:date=Field(...,description="date of newsletter release")
    cover_image_url:str=Field(...,description="cover image url")
    pdf_url:str=Field(...,description="pdf url")

    class Config:
        from_attributes=True