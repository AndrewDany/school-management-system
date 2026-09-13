# School Management System — Phase 1 (MVP Foundation)

A full-stack starting point for the school management system: authentication with
roles, student records, and class/section management. Attendance, grades, fees, and
timetable modules build on top of this in later phases.

## Stack
- **Backend:** Node.js + Express, PostgreSQL via Sequelize, JWT auth, bcrypt password hashing
- **Frontend (web):** React (Vite) + Tailwind CSS, React Router, Axios
- **Mobile:** React Native (Expo), reusing the same backend API

## What's included
- User roles: `admin`, `teacher`, `student`, `parent`
- Register/login with JWT, role-based route protection (frontend + backend)
- Student CRUD (admission number, guardian info, class assignment, status)
- Class/Section CRUD (grade level, section, academic year, teacher assignment)
- Attendance: mark daily attendance per class, one record per student per day
- Timetable: weekly schedule per class with class/teacher double-booking prevention
- Subjects management
- Grades: record scores per class/subject/term, view a student's report card with average
- Fees & billing: set fee structure per class/term, record payments, view outstanding balance
- Relationships wired up throughout (a class has many students, grades, fee structures, etc.)

## Getting started

### 1. Database
Install PostgreSQL locally (or use a hosted instance) and create a database:
```
createdb school_management
```

### 2. Backend
```
cd backend
cp .env.example .env      # then edit .env with your DB credentials and a JWT secret
npm install
npm run dev                # starts on http://localhost:5000
```
On first run, Sequelize will auto-create the tables (`sequelize.sync({ alter: true })`).
Swap this for real migrations before going to production.

### 3. Frontend
```
cd frontend
npm install
npm run dev                # starts on http://localhost:5173, proxies /api to the backend
```

### 4. Try it out
1. Go to `http://localhost:5173/register` and create an **admin** account.
2. Log in, then use the **Classes** page to add a class (e.g. Grade 6 - A - 2026/2027).
3. Use the **Students** page to add students and assign them to that class.

## Mobile app
See `mobile/README.md` for setup — it's a separate Expo app that talks to this
same backend, scoped to student self-service (attendance, report card, fees)
and teacher attendance-marking on the go.

## What's next (see the roadmap discussed in chat)
- **Phase 5:** Multi-school (multi-tenant) support, admin reporting dashboard, public landing page

## Notes
- Only admins can create/edit/delete students and classes right now — adjust
  `authorize(...)` calls in `backend/src/routes/` as your permission model firms up.
- The `/auth/register` endpoint is open for initial setup. Before going live, lock
  it down so only an existing admin can create new admin/teacher accounts.
