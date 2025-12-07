from typing import Optional
from pydantic import BaseModel
from app.models.request import RequestStatus  # імпортуємо Enum з моделей

class RequestBase(BaseModel):
    description: str
    device_id: int
    client_id: int
    priority: str | None = None
    category: Optional[str] = None

class RequestCreate(RequestBase):
    pass

class RequestRead(RequestBase):
    id: int
    status: RequestStatus  # використовуємо Enum напряму

    class Config:
        from_attributes = True  # для Pydantic v2

class StatusUpdate(BaseModel):
    status: RequestStatus
