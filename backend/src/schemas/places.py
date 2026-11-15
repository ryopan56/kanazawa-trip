from pydantic import BaseModel


class PlaceCreate(BaseModel):
    name: str
    address: str | None = None
