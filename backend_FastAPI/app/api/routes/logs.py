from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.logs import ProcessingLog
from app.schemas.logs import LogRead

router = APIRouter(prefix="/logs", tags=["logs"])

@router.get("", response_model=list[LogRead])
def list_logs(db: Session = Depends(get_db)):
    return db.query(ProcessingLog).order_by(ProcessingLog.event_ts.desc()).all()

@router.get("/requests/{request_id}", response_model=list[LogRead])
def get_request_logs(request_id: int, db: Session = Depends(get_db)):
    logs = db.query(ProcessingLog).filter(ProcessingLog.request_id == request_id).order_by(ProcessingLog.event_ts.asc()).all()
    if not logs:
        raise HTTPException(status_code=404, detail="No logs found for this request")
    return logs

