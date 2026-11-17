from pydantic import BaseModel, field_validator


class PlaceCreate(BaseModel):
    name: str
    address: str | None = None


class PlaceUpdate(BaseModel):
    name: str | None = None
    address: str | None = None

    @field_validator("name", mode="before")
    @classmethod
    def reject_null_and_empty_string(cls, value):
        if value is None:
            raise ValueError("This field may not be null")

        if value == "":
            raise ValueError("This field may not be empty string")

        return value
