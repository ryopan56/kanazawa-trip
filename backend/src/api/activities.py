from fastapi import Request, APIRouter, HTTPException, Depends
from db.activities import get_activities
from auth.dependencies import get_current_user_id

router = APIRouter(prefix="/api/trips/{tid}/activities", tags=["activities"])


@router.get("")
async def list_activities(
    request: Request, tid: int, user_id: int = Depends(get_current_user_id)
):
    env = request.scope["env"]

    activities_list = await get_activities(env.DB, tid, user_id)

    if activities_list is None:
        raise HTTPException(status_code=404, detail="Trip not found")

    return activities_list
