from sqlalchemy import Column, Integer, String, DateTime, Enum, text, func
from app.db.base import Base
import enum

class RequestStatus(enum.Enum):
    new = "new"
    in_progress = "in_progress"
    awaiting_parts = "awaiting_parts"
    completed = "completed"
    cancelled = "cancelled"

class Request(Base):   # <--- наслідуємо Base
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    client_id = Column(Integer, nullable=False)
    device_id = Column(Integer, nullable=False)
    description = Column(String(500))
    status = Column(Enum(RequestStatus), default=RequestStatus.new)
    priority = Column(String(50))
    category = Column(String(100))
    # created_at = Column(DateTime, server_default=text("SYSUTCDATETIME()"))
    # updated_at = Column(DateTime, server_default=text("SYSUTCDATETIME()"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
