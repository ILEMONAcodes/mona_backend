from fastapi import FastAPI
from app.config import settings
from app.routers import ai

app = FastAPI(title=settings.PROJECT_NAME)

# Include the AI processing router
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to MONA AI Backend"}