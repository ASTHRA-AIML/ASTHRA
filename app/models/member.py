from app.db.session import Base
from sqlalchemy import Column,Integer,String,VARCHAR,DATETIME,ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship

class members(Base):
    __tablename__="members"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(VARCHAR(255),nullable=False)
    photo_url=Column(VARCHAR(500),nullable=True)
    linkedin_url=Column(VARCHAR(500),nullable=True)
    created_at=Column(DATETIME,default=datetime.utcnow)
    updated_at=Column(DATETIME,default=datetime.utcnow,onupdate=datetime.utcnow)

    memberships=relationship("memberships",back_populates="member",cascade="all,delete-orphan")
