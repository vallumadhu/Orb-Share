from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes.note import router as notes_router
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "healthy"}

origins = [
    "https://orbshare.netlify.app",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok"}

app.include_router(
    notes_router,
    prefix="/api",
    tags=["Notes"]
)