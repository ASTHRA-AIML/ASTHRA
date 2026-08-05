from app.db.session import Base
from sqlalchemy import Column,Integer,String,VARCHAR,DATE,TEXT,DATETIME
from datetime import datetime
from sqlalchemy.orm import relationship

class activities(Base):
    __tablename__="activities"
    id=Column(Integer,primary_key=True,index=True)
    title=Column(VARCHAR(255),nullable=False)
    activity_date=Column(DATE,nullable=False)
    thumbnail_url=Column(VARCHAR(500),nullable=False)
    description=Column(TEXT,nullable=False)
    created_at=Column(DATETIME,default=datetime.utcnow)
    updated_at=Column(DATETIME,default=datetime.utcnow,onupdate=datetime.utcnow)

    images=relationship("activity_images",back_populates="activity",cascade="all,delete-orphan")

    @property
    def image_url(self) -> list[str]:
        return [img.image_url for img in self.images]