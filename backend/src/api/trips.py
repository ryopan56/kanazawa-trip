from fastapi import Request, APIRouter, HTTPException, Depends
from db.trips import get_trips, create_trip, update_trip, delete_trip
from schemas.trips import TripCreate, TripUpdate
from auth.dependencies import get_current_user_id

router = APIRouter(prefix="/api/trips", tags=["trips"])


@router.get("")
async def list_trips(request: Request, user_id: int = Depends(get_current_user_id)):
    env = request.scope["env"]

    return await get_trips(env.DB, user_id)


@router.post("", status_code=201)
async def create_trip_api(
    request: Request, trip: TripCreate, user_id: int = Depends(get_current_user_id)
):
    env = request.scope["env"]
    data = trip.model_dump(mode="json")
    return await create_trip(
        env.DB, data["name"], data["start_date"], data["end_date"], user_id
    )


@router.patch("/{tid}")
async def update_trip_api(
    tid: int,
    request: Request,
    trip: TripUpdate,
    user_id: int = Depends(get_current_user_id),
):
    env = request.scope["env"]
    updates = trip.model_dump(
        exclude_unset=True,
        mode="json",  # JSONにはdate型が存在しないためdateオブジェクトはISO形式になる
    )

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    updated_trip = await update_trip(env.DB, tid, updates, user_id)
    if updated_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")

    return updated_trip


@router.delete("/{tid}", status_code=204)
async def delete_trip_api(
    tid: int, request: Request, user_id: int = Depends(get_current_user_id)
):
    env = request.scope["env"]

    deleted_trip = await delete_trip(env.DB, tid, user_id)

    if not deleted_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
