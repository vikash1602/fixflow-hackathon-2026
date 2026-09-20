# FixFlow

FixFlow is a real-time issue reporting and resolution system built for the Adyapan Full Stack Hackathon 2026.

The idea is simple: students or users can report problems around the campus, and staff members can view, manage, assign, and update those issues until they are resolved.

## What problem does it solve?

In a campus, issues such as water leakage, broken street lights, electrical problems, waste management, or internet problems are usually reported through different channels.

FixFlow provides one place where these issues can be reported and tracked.

A user can report an issue and get an issue ID. Staff members can then take the issue, update its status, and mark it as resolved.

## Main Features

- User registration and login
- JWT-based authentication
- Role-based access for users and staff
- Report a new campus issue
- Automatic issue ID generation
- Issue categories and priority levels
- View and track reported issues
- Staff assignment
- Update issue status
- Dashboard with issue statistics
- PostgreSQL database for storing data
- REST API using FastAPI
- Responsive React frontend

## Issue Status

The issue follows this basic workflow:

`REPORTED → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED`

This makes it easy for users to understand the current state of their reported issue.

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Axios
- React Router

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

### Database

- PostgreSQL

## Project Structure

```text
fixflow-hackathon-2026/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md



Running the Backend

First, create and activate a virtual environment inside the backend folder.

python -m venv .venv

On Windows:

.\.venv\Scripts\Activate.ps1

Install the required packages:

pip install -r requirements.txt

Create a .env file in the backend folder and add the required database configuration.

Then start the FastAPI server:

uvicorn app.main:app --reload

The API will be available at:

http://127.0.0.1:8000

FastAPI also provides interactive API documentation at:

http://127.0.0.1:8000/docs
Running the Frontend

Go to the frontend folder:

cd frontend

Install the dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally be available at:

http://localhost:5173
API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
Issues
POST  /api/issues
GET   /api/issues
GET   /api/issues/{issue_id}
PATCH /api/issues/{issue_id}/assign
PATCH /api/issues/{issue_id}/status
Example Workflow

A typical workflow in FixFlow looks like this:

A user creates an account and logs in.
The user reports an issue such as a water leakage.
FixFlow generates an issue ID such as FXF-000002.
The issue initially has the REPORTED status.
A staff member is assigned to the issue.
The issue moves to ASSIGNED and then IN_PROGRESS.
After the problem is fixed, the staff member can mark it as RESOLVED.
The issue can finally be closed.
Database

The application uses PostgreSQL to persist users and reported issues.

The backend uses SQLAlchemy to communicate with PostgreSQL.

Authentication & Access

FixFlow uses JWT authentication for protected API requests.

Different users have different permissions. Normal users can manage their own reports, while staff members have access to issues assigned to them and can update their status.

Hackathon

Built as part of the Adyapan Full Stack Hackathon 2026.

Selected Problem Statement:
FixFlow — Real-Time Issue Reporting & Resolution System