from fastapi import FastAPI
from workers import asgi
from api.trips import router as trip_router
from api.auth import router as login_router
from api.places import router as place_router

app = FastAPI()


@app.get("/api/")
async def root():
    return {"message": "OK"}


app.include_router(trip_router)
app.include_router(login_router)
app.include_router(place_router)

Default = asgi.entrypoint(app)
