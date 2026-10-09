from fastapi import FastAPI
from workers import asgi

app = FastAPI()

@app.get("/api/")
async def root():
  return {"mesage": "OK"}

Default = asgi.entrypoint(app)
