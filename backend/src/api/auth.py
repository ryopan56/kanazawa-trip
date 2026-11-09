from fastapi import Request, Response, APIRouter, HTTPException
from auth.service import authenticate_user, create_access_token
from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


router = APIRouter(prefix="/api", tags=["login"])


@router.post("/login")
async def login(request: Request, response: Response, login_data: LoginRequest):
    env = request.scope["env"]

    user_id = await authenticate_user(env.DB, login_data.email, login_data.password)

    if user_id is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = create_access_token(user_id, env.JWT_SECRET)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=86400,
        path="/",
    )

    return {"message": "authenticated"}


@router.post("/logout", status_code=204)
async def logout(response: Response):
    response.delete_cookie(key="access_token")
