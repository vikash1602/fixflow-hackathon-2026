from datetime import datetime
import enum

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class IssueCategory(str, enum.Enum):
    ROADS = "ROADS"
    WATER = "WATER"
    ELECTRICAL = "ELECTRICAL"
    WASTE = "WASTE"
    INTERNET = "INTERNET"
    CLEANING = "CLEANING"
    OTHER = "OTHER"


class IssuePriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class IssueStatus(str, enum.Enum):
    REPORTED = "REPORTED"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"


class Issue(Base):
    __tablename__ = "issues"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    issue_code: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        index=True,
        nullable=False
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    category: Mapped[IssueCategory] = mapped_column(
        Enum(IssueCategory),
        nullable=False
    )

    priority: Mapped[IssuePriority] = mapped_column(
        Enum(IssuePriority),
        default=IssuePriority.MEDIUM,
        nullable=False
    )

    status: Mapped[IssueStatus] = mapped_column(
        Enum(IssueStatus),
        default=IssueStatus.REPORTED,
        nullable=False
    )

    reporter_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )