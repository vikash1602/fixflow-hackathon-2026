from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.issue import (
    IssueCategory,
    IssuePriority,
    IssueStatus,
)


class IssueCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=5)
    category: IssueCategory
    priority: IssuePriority = IssuePriority.MEDIUM


class IssueAssign(BaseModel):
    staff_id: int


class IssueStatusUpdate(BaseModel):
    status: IssueStatus


class IssueResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    issue_code: str
    title: str
    description: str
    category: IssueCategory
    priority: IssuePriority
    status: IssueStatus
    reporter_id: int
    assigned_staff_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime