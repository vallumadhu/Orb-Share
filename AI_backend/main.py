from fastapi import FastAPI

from routes.note import router as notes_router
app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok"}

app.include_router(
    notes_router,
    prefix="/api",
    tags=["Notes"]
)