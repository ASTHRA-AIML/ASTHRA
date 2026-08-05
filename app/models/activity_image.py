from app.db.session import Base
from sqlalchemy import Column,Integer,String,VARCHAR,ForeignKey
from sqlalchemy.orm import relationship

class activity_images(Base):
    __tablename__="activity_images"
    id=Column(Integer,primary_key=True,index=True)
    activity_id=Column(Integer,ForeignKey("activities.id",ondelete="CASCADE"))
    image_url=Column(VARCHAR(500),nullable=False)

    activity=relationship("activities",back_populates="images")