from pydantic import BaseModel
from datetime import datetime

class LogBase(BaseModel):
    request_id: int
    level: str
    message: str
    payload: dict | None = None

class LogRead(LogBase):
    id: int
    event_ts: datetime

    class Config:
        from_attributes = True
