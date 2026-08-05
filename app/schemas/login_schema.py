from pydantic import BaseModel,Field

class loginRequest(BaseModel):
    username:str=Field(...,description="username of the admin")
    password:str=Field(...,description="password of the admin")