from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.session import SessionLocal
from app.schemas.request import RequestCreate, RequestRead, StatusUpdate
from app.models.request import Request as RequestModel, RequestStatus as ModelStatus
from app.models.logs import ProcessingLog
from ml.train import MODEL

router = APIRouter(prefix="/requests", tags=["requests"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("", response_model=RequestRead, status_code=201)
def create_request(payload: RequestCreate, db: Session = Depends(get_db)):
    
    req = RequestModel(
        description=payload.description,
        device_id=payload.device_id,
        client_id=payload.client_id,
        priority=payload.priority,
        category=payload.category or MODEL.predict(payload.description),
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    log = ProcessingLog(request_id=req.id, level="info", message="request_created", payload=payload.model_dump())
    db.add(log)
    db.commit()

    return RequestRead(
        id=req.id, description=req.description, device_id=req.device_id, client_id=req.client_id,
        status=req.status.value, priority=req.priority, category=req.category
    )

@router.get("", response_model=list[RequestRead])
def list_requests(
    status_filter: ModelStatus | None = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(RequestModel).order_by(RequestModel.created_at.desc())
    if status_filter:
        query = query.filter(RequestModel.status == status_filter)
    rows = query.limit(limit).offset(offset).all()
    return [
        RequestRead(
            id=r.id, description=r.description, device_id=r.device_id, client_id=r.client_id,
            status=r.status.value, priority=r.priority, category=r.category
        )
        for r in rows
    ]

@router.get("/{id}", response_model=RequestRead)
def get_request(id: int, db: Session = Depends(get_db)):
    r = db.query(RequestModel).get(id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")
    return RequestRead(
        id=r.id, description=r.description, device_id=r.device_id, client_id=r.client_id,
        status=r.status.value, priority=r.priority, category=r.category
    )

@router.put("/{id}/status", response_model=RequestRead)
def update_status(id: int, payload: StatusUpdate, db: Session = Depends(get_db)):
    r = db.query(RequestModel).get(id)
    if not r:
        raise HTTPException(status_code=404, detail="Request not found")

    if r.status in {ModelStatus.completed, ModelStatus.cancelled}:
        raise HTTPException(status_code=409, detail="Immutable final status")

    r.status = ModelStatus(payload.status.value)
    db.add(r)

    log = ProcessingLog(request_id=id, level="info", message="status_changed", payload={"to": payload.status.value})
    db.add(log)

    db.commit()
    db.refresh(r)

    return RequestRead(
        id=r.id, description=r.description, device_id=r.device_id, client_id=r.client_id,
        status=r.status.value, priority=r.priority, category=r.category
    )
