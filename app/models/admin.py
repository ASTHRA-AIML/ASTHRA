from app.db.session import Base
from sqlalchemy import Column,Integer,String,VARCHAR,DATETIME
from datetime import datetime

class admins(Base):
    __tablename__="admins"
    id=Column(Integer,primary_key=True,index=True)
    username=Column(VARCHAR(100),unique=True,nullable=False)
    hashed_password=Column(VARCHAR(255),nullable=False)
    created_at=Column(DATETIME,default=datetime.utcnow)
    updated_at=Column(DATETIME,default=datetime.utcnow,onupdate=datetime.utcnow)