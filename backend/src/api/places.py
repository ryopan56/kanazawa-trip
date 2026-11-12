from fastapi import Request, APIRouter, HTTPException, Depends
from db.places import get_places
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
