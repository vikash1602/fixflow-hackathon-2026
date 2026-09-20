from datetime import datetime
from sqlalchemy import DateTime, Enum, String
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    USER = "USER"
    STAFF = "STAFF"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.USER)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
