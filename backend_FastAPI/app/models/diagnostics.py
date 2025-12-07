from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, text, func
from app.db.base import Base

class Diagnostics(Base):   # <--- додаємо Base тут
    __tablename__ = "diagnostics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    request_id = Column(Integer, ForeignKey("requests.id", ondelete="CASCADE"))
    notes = Column(String(1000))
    result_code = Column(String(100))
    #created_at = Column(DateTime, server_default=text("SYSUTCDATETIME()"))
    created_at = Column(DateTime, server_default=func.now())
