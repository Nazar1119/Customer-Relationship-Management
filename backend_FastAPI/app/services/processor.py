# app/services/processor.py
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.logs import ProcessingLog

async def run_diagnostics(request_id: int, db: AsyncSession, cmd: list[str]):
    proc = await asyncio.create_subprocess_exec(*cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    out, err = await proc.communicate()
    db.add(ProcessingLog(request_id=request_id, level="info", message="subprocess_stdout", payload={"stdout": out.decode()}))
    if err:
        db.add(ProcessingLog(request_id=request_id, level="warn", message="subprocess_stderr", payload={"stderr": err.decode()}))
    db.add(ProcessingLog(request_id=request_id, level="info", message="subprocess_exit", payload={"code": proc.returncode}))
    await db.commit()
