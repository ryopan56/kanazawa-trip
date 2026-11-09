from fastapi import Request, HTTPException
from auth.service import get_user_id_from_token
import jwt


async def get_current_user_id(request: Request) -> int:
    token = request.cookies.get("access_token")
    if token is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    env = request.scope["env"]
    try:
        user_id = get_user_id_from_token(token, env.JWT_SECRET)
        return user_id
    except (jwt.InvalidTokenError, ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Unauthorized")
