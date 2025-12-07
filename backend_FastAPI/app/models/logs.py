from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, text, func
from app.db.base import Base

class ProcessingLog(Base):   # <--- додаємо Base тут
    __tablename__ = "processing_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    request_id = Column(Integer, ForeignKey("requests.id", ondelete="CASCADE"))
    event_ts = Column(DateTime, server_default=func.now())
    level = Column(String(50))
    message = Column(String(255))
    payload = Column(JSON)
