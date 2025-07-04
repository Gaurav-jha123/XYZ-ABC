from pydantic import BaseModel, Field
from typing import Dict, Any

class ChatPrompt(BaseModel): 
    message: str = Field(..., min_length=1, description="User's chat input")
    semantics: str = Field(default_factory=str, description="Parsed semantic metadata from Omni Parser")
