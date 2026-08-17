from pydantic import BaseModel,Field
from datetime import date



# class allmembersResponse(BaseModel):
#     name:str
#     photo_url:str
#     position:str
#     linkedin_url:str
#     acadamic_year:str

#     class config:
#         from_attributes=True


class memberRequest(BaseModel):
    name:str=Field(...,description="name")
    photo_url:str=Field(...,description="photo_url")
    position:str=Field(...,description="position")
    linkedin_url:str=Field(...,description="linkedin_url")
    acadamic_year:str=Field(...,description="acadamic_year")

    class config:
        from_attributes=True


class addmembershipRequest(BaseModel):
    acadamic_year:str=Field(...,description="2025-26")
    position:str=Field(...,description="Treasurer")

    class config:
        from_attributes=True


class membershipResponse(BaseModel):
    id: int
    acadamic_year: str
    position: str

    class config:
        from_attributes = True


class memberAdminResponse(BaseModel):
    id: int
    name: str
    photo_url: str | None = None
    linkedin_url: str | None = None

    class config:
        from_attributes = True


class memberAdminDetailResponse(BaseModel):
    id: int
    name: str
    photo_url: str | None = None
    linkedin_url: str | None = None
    memberships: list[membershipResponse] = []

    class config:
        from_attributes = True


class currentcommitteeResponse(BaseModel):
    id: int
    name: str
    photo_url: str | None = None
    linkedin_url: str | None = None
    position: str

    class config:
        from_attributes = True

class allcommitteeResponse(BaseModel):
    acadamic_year: str
    members: list[currentcommitteeResponse]

    class config:
        from_attributes = True