from app.db.session import Base
from sqlalchemy import Column,Integer,VARCHAR,DATE,TEXT,DATETIME
from datetime import datetime

class newsletters(Base):
    __tablename__="newsletters"
    id=Column(Integer,primary_key=True,index=True)
    title=Column(VARCHAR(255),nullable=False)
    cover_image_url=Column(VARCHAR(500),nullable=False)
    newsletter_date=Column(DATE,nullable=False)
    description=Column(TEXT,nullable=False)
    pdf_url=Column(VARCHAR(500),nullable=False)
    created_at=Column(DATETIME,default=datetime.utcnow)
    updated_at=Column(DATETIME,default=datetime.utcnow,onupdate=datetime.utcnow)