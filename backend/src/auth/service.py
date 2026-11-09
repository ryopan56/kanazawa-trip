from db.users import get_user_by_email
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from datetime import datetime, timezone, timedelta
import jwt


ph = PasswordHasher()


def hash_password(password: str) -> str:
    return ph.hash(password)


def verify_password(password_hash: str, password: str) -> bool:
    try:
        return ph.verify(password_hash, password)
    except VerifyMismatchError:
        return False


async def authenticate_user(db, email: str, password: str) -> int | None:
    result = await get_user_by_email(db, email)
    if result is None:
        return None

    is_valid = verify_password(result["password_hash"], password)
    if is_valid is False:
        return None

    return result["id"]


def create_access_token(user_id: int, secret: str) -> str:
    now = datetime.now(timezone.utc)
    token_expiration = now + timedelta(hours=24)
    payload = {"sub": str(user_id), "exp": token_expiration}
    token = jwt.encode(payload, secret, algorithm="HS256")
    return token


def get_user_id_from_token(token: str, secret: str) -> int:
    payload = jwt.decode(
        token, secret, algorithms=["HS256"], options={"require": ["sub", "exp"]}
    )
    return int(payload["sub"])
