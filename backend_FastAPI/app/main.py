from fastapi import FastAPI
from app.api.routes.requests import router as requests_router
from app.api.routes.reports import router as reports_router
from app.db.init_db import init_db
from app.api.routes import diagnostics
from app.api.routes import reports
from app.api.routes import logs

app = FastAPI(title="Repair Requests Service")

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(requests_router)
app.include_router(reports_router)
app.include_router(diagnostics.router)
app.include_router(reports.router)
app.include_router(logs.router)
