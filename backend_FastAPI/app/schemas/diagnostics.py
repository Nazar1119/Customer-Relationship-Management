from pydantic import BaseModel
from datetime import datetime

class DiagnosticsBase(BaseModel):
    request_id: int
    notes: str
    result_code: str

class DiagnosticsCreate(DiagnosticsBase):
    pass

class DiagnosticsRead(DiagnosticsBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # для Pydantic v2
