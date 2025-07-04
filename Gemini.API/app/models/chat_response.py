from pydantic import BaseModel, Field
from typing import Optional

class ChatResponse(BaseModel):
    text: str = Field(..., description="Main response message")