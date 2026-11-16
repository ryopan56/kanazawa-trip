from fastapi import Request, APIRouter, HTTPException, Depends
from db.places import get_places, create_place, update_place
from schemas.places import PlaceCreate, PlaceUpdate
from auth.dependencies import get_current_user_id

router = APIRouter(prefix="/api/trips/{tid}/places", tags=["places"])


@router.get("")
async def list_places(
    request: Request, tid: int, user_id: int = Depends(get_current_user_id)
):
    env = request.scope["env"]

    place_list = await get_places(env.DB, tid, user_id)

    if place_list is None:
        raise HTTPException(status_code=404, detail="Trip not found")

    return place_list


@router.post("", status_code=201)
async def create_place_api(
    request: Request,
    place: PlaceCreate,
    tid: int,
    user_id: int = Depends(get_current_user_id),
):
    env = request.scope["env"]
    posteddata = await create_place(env.DB, tid, user_id, place.name, place.address)

    if posteddata is None:
        raise HTTPException(status_code=404, detail="Trip not found")

    return posteddata


@router.patch("/{pid}")
async def update_place_api(
    tid: int,
    pid: int,
    request: Request,
    place: PlaceUpdate,
    user_id: int = Depends(get_current_user_id),
):
    env = request.scope["env"]
    updates = place.model_dump(exclude_unset=True, mode="json")

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    updated_data = await update_place(env.DB, tid, updates, user_id, pid)
    if updated_data is None:
        raise HTTPException(status_code=404, detail="Place not found")

    return updated_data
