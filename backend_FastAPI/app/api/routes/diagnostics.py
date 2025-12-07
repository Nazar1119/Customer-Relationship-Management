from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.diagnostics import Diagnostics
from app.schemas.diagnostics import DiagnosticsCreate, DiagnosticsRead

router = APIRouter()

@router.post("/diagnostics", response_model=DiagnosticsRead)
def create_diagnostics(diag: DiagnosticsCreate, db: Session = Depends(get_db)):
    obj = Diagnostics(**diag.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/diagnostics", response_model=list[DiagnosticsRead])
def list_diagnostics(db: Session = Depends(get_db)):
    return db.query(Diagnostics).all()

@router.get("/diagnostics/{id}", response_model=DiagnosticsRead)
def get_diagnostics(id: int, db: Session = Depends(get_db)):
    obj = db.query(Diagnostics).filter(Diagnostics.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Diagnostics not found")
    return obj
