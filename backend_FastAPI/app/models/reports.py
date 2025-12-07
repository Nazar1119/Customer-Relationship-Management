from sqlalchemy import Column, Integer, DateTime, JSON, text, func
from app.db.base import Base

class Report(Base):   # <--- додаємо Base тут
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, autoincrement=True)
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    summary_json = Column(JSON)
    generated_at = Column(DateTime, server_default=func.now())
