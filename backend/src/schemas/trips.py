from pydantic import BaseModel, model_validator, field_validator
from datetime import date

class TripCreate(BaseModel):
  name: str
  start_date: date
  end_date: date

  @model_validator(mode="after")
  def validate_period(self):
    if self.start_date > self.end_date:
      raise ValueError("旅行終了日は旅行開始日以降にして下さい")
    return self

  @field_validator("name", mode="before")
  @classmethod
  def reject_empty_string(cls, value):
    if value == "":
      raise ValueError("This field may not be empty string")
    
    return value

class TripUpdate(BaseModel):
  name: str | None = None
  start_date: date | None = None
  end_date: date | None = None

  @model_validator(mode="after")
  def validate_period(self):
    date_fields = {"start_date", "end_date"}
    provided_date_fields = self.model_fields_set & date_fields

    if provided_date_fields and provided_date_fields != date_fields:
      raise ValueError(
        "旅行期間を変更する場合は開始日と終了日の両方を指定して下さい"
      )
    
    if provided_date_fields == date_fields:
      if self.start_date > self.end_date:
        raise ValueError("旅行終了日は旅行開始日以降にして下さい")

    return self

  @field_validator("name", "start_date", "end_date", mode="before")
  @classmethod
  def reject_null_and_empty_string(cls, value):
    if value is None:
      raise ValueError("This field may not be null")

    if value == "":
      raise ValueError("This field may not be empty string")
    
    return value
