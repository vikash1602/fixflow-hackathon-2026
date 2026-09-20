from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.issue import (
    Issue,
    IssueCategory,
    IssuePriority,
    IssueStatus,
)
from app.models.user import User, UserRole
from app.routes.auth import get_current_user
from app.schemas.issue import (
    IssueAssign,
    IssueCreate,
    IssueResponse,
    IssueStatusUpdate,
)


router = APIRouter(
    prefix="/api/issues",
    tags=["Issues"],
)


def require_staff_or_admin(current_user: User):
    """Allow only STAFF or ADMIN users."""
    if current_user.role not in [UserRole.STAFF, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Staff or Admin access required",
        )



@router.post(
    "",
    response_model=IssueResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_issue(
    payload: IssueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    issue = Issue(
        issue_code="TEMP",
        title=payload.title.strip(),
        description=payload.description.strip(),
        category=payload.category,
        priority=payload.priority,
        status=IssueStatus.REPORTED,
        reporter_id=current_user.id,
    )

    db.add(issue)
    db.flush()

    issue.issue_code = f"FXF-{issue.id:06d}"

    db.commit()
    db.refresh(issue)

    return issue



@router.get(
    "",
    response_model=list[IssueResponse],
)
def get_issues(
    category: Optional[IssueCategory] = None,
    priority: Optional[IssuePriority] = None,
    issue_status: Optional[IssueStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Issue)

    
    if current_user.role == UserRole.USER:
        query = query.filter(
            Issue.reporter_id == current_user.id
        )

    if category:
        query = query.filter(
            Issue.category == category
        )

    if priority:
        query = query.filter(
            Issue.priority == priority
        )

    if issue_status:
        query = query.filter(
            Issue.status == issue_status
        )

    return query.order_by(
        Issue.created_at.desc()
    ).all()


@router.get(
    "/{issue_id}",
    response_model=IssueResponse,
)
def get_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    issue = db.get(Issue, issue_id)

    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found",
        )


    if (
        current_user.role == UserRole.USER
        and issue.reporter_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own issues",
        )

    return issue



@router.patch(
    "/{issue_id}/assign",
    response_model=IssueResponse,
)
def assign_issue(
    issue_id: int,
    payload: IssueAssign,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    require_staff_or_admin(current_user)

    issue = db.get(Issue, issue_id)

    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found",
        )

    staff = db.get(User, payload.staff_id)

    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff user not found",
        )

    # Only STAFF can be assigned
    if staff.role != UserRole.STAFF:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected user is not a staff member",
        )


    issue.status = IssueStatus.ASSIGNED

    db.commit()
    db.refresh(issue)

    return issue

@router.patch(
    "/{issue_id}/status",
    response_model=IssueResponse,
)
def update_issue_status(
    issue_id: int,
    payload: IssueStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    require_staff_or_admin(current_user)

    issue = db.get(Issue, issue_id)

    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found",
        )


    if current_user.role not in [UserRole.STAFF, UserRole.ADMIN]:
        raise HTTPException(
                status_code=403,
                detail="Staff or Admin access required",
            )

    

    issue.status = payload.status

    db.commit()
    db.refresh(issue)

    return issue