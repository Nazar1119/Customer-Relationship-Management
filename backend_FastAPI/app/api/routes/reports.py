from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.reports import Report
from app.schemas.report import ReportCreate, ReportRead

router = APIRouter()

@router.post("/reports", response_model=ReportRead)
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    obj = Report(**report.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/reports/{id}", response_model=ReportRead)
def get_report(id: int, db: Session = Depends(get_db)):
    obj = db.query(Report).filter(Report.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Report not found")
    return obj

@router.get("/reports", response_model=list[ReportRead])
def list_reports(db: Session = Depends(get_db)):
    return db.query(Report).order_by(Report.generated_at.desc()).all()
