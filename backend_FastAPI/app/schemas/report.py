from pydantic import BaseModel
from datetime import datetime

class ReportBase(BaseModel):
    period_start: datetime
    period_end: datetime
    summary_json: dict

class ReportCreate(ReportBase):
    pass

class ReportRead(ReportBase):
    id: int
    generated_at: datetime

    class Config:
        from_attributes = True
