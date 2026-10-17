from fastapi import  Request, APIRouter, HTTPException
from db.trips import get_trips, create_trip, update_trip, delete_trip
from schemas.trips import TripCreate, TripUpdate

router = APIRouter(prefix="/api/trips", tags=["trips"])

@router.get("")
async def list_trips(request: Request):
  env = request.scope["env"]

  return await get_trips(env.DB)

@router.post("", status_code=201)
async def create_trip_api(request: Request, trip: TripCreate):
  env = request.scope["env"]
  data = trip.model_dump(mode="json")
  return await create_trip(
    env.DB,
    data["name"],
    data["start_date"],
    data["end_date"]
  )

@router.patch("/{tid}")
async def update_trip_api(tid: int, request: Request, trip: TripUpdate):
  env = request.scope["env"]
  updates = trip.model_dump(
    exclude_unset=True,
    mode="json"  # JSONにはdate型が存在しないためdateオブジェクトはISO形式になる
    )

  if not updates:
    raise HTTPException(status_code=400, detail="No fields to update")

  updated_trip = await update_trip(env.DB, tid, updates)
  if updated_trip is None:
    raise HTTPException(status_code=404, detail="Trip not found")

  return updated_trip

@router.delete("/{tid}", status_code=204)
async def delete_trip_api(tid: int, request: Request):
  env = request.scope["env"]

  deleted_trip = await delete_trip(env.DB, tid)

  if not deleted_trip:
    raise HTTPException(status_code=404, detail="Trip not found")
