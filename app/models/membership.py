from app.db.session import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Integer,String,Column,VARCHAR,DATETIME,ForeignKey
from datetime import datetime

class memberships(Base):
    __tablename__="memberships"
    id=Column(Integer,primary_key=True,index=True)
    member_id=Column(Integer,ForeignKey("members.id",ondelete="CASCADE"))
    acadamic_year=Column(VARCHAR(20),nullable=False)
    position=Column(VARCHAR(100),nullable=False)
    created_at=Column(DATETIME,default=datetime.utcnow)

    member=relationship("members",back_populates="memberships")