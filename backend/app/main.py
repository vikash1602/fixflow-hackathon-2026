from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import User
from app.models.issue import Issue
from app.routes.auth import router as auth_router
from app.routes.issues import router as issues_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="FixFlow API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)

app.include_router(issues_router)


@app.get("/")
def root():
    return {
        "message": "FixFlow API is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok"
    }