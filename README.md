# FixFlow

Real-Time Issue Reporting & Resolution System for the Adyapan Full Stack Hackathon 2026.

## Hour 1 scope
- React + Vite frontend
- FastAPI backend
- PostgreSQL persistence
- User registration and login
- JWT authentication
- User roles: USER, STAFF, ADMIN
- Responsive base dashboard

## Next step
Implement issue creation, issue codes, listing, details, search, and filtering.

## Run backend
1. Create a PostgreSQL database named `fixflow` and user `fixflow` (or change `DATABASE_URL`).
2. Copy `backend/.env.example` to `backend/.env`.
3. From `backend`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Run frontend
From `frontend`:

```powershell
npm install
npm run dev
```
