from fastapi import FastAPI, Request
from workers import asgi

app = FastAPI()

@app.get("/api/")
async def root():
  return {"mesage": "OK"}

@app.get("/api/trips")
async def get_trips(request: Request):
  env = request.scope["env"]

  result = await env.DB.prepare(
    "SELECT id, start_date, end_date FROM trips ORDER BY start_date, id").run()

  return result.results
  
Default = asgi.entrypoint(app)
