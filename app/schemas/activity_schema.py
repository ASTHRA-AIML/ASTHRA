from pydantic import BaseModel,Field
from datetime import date

class activityResponse(BaseModel):
    id:int
    title:str
    activity_date:date
    thumbnail_url:str

    class Config:
        from_attributes=True # Use orm_mode = True if using Pydantic v1


class activityRequest(BaseModel):
    title:str=Field(...,description="title")
    activity_date:date=Field(...,description="date in year")
    thumbnail_url:str=Field(...,description="thumbnail_url")
    description:str=Field(...,description="description")
    image_url:list[str]=Field(...,description="image_url")

    class Config:
        from_attributes=True

class activitypageResponse(BaseModel):
    id:int
    title:str
    activity_date:date
    description:str
    image_url:list[str]

    class Config:
        from_attributes=True