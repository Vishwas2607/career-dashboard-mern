📌 Career Dashboard

Project Description

Career Dashboard is a full-stack MERN learning project built to practice authentication, protected routes, CRUD operations, and data visualization in a real-world job application tracking scenario.

This project focuses on learning architecture, state management, API integration, and deployment, rather than production-level polish. The goal was to ship a functional end-to-end system and document tradeoffs honestly.

🛠️ Tech Stack
Frontend

React + TypeScript

TailwindCSS

TanStack Query (useQuery, useMutation, prefetching)

Framer Motion (sidebar animation, delete transitions)

shadCN UI (bar chart, pie chart)

Vercel (deployment)

Backend

Node.js

Express.js v5+

MongoDB Atlas

Mongoose

Render (deployment)

Authentication & Security

Cookie-based authentication

Access + refresh tokens

Token rotation

Auth middleware

Rate limiting

Helmet

Environment-based Morgan logging

✨ Features
Authentication & User Flow

Public home page

Register & login flow

Protected frontend routes

Cookie-based authentication

User profile page

Logout support

Job Application Management

Add, edit, delete job applications

Edit uses the same form as “Add” (detects jobId from route params)

View full job details

External job link support

Status badges with color indicators

Pagination when applications exceed 10 entries

Disabled pagination states handled

Dashboard

Bar chart & pie chart for application statistics

Recent 10 job applications displayed

UI & UX

Dark / light theme with persistence

Sidebar & navbar

Smooth delete animations (Framer Motion)

404 page for unknown routes

Data Fetching & Performance

Centralized API service (useCallApi)

useQuery for data fetching

useMutation for delete & update

Prefetching job details on hover for faster navigation

🗂️ Project Structure
Root
career-dashboard-mern/
├── frontend/
├── server/
├── README.md
├── .gitignore

Frontend (frontend/src)
components/
context/
hooks/
layouts/
pages/
services/
types/


(Main app files like App.tsx, styles, and config live alongside these folders.)

Backend (server)
config/
controllers/
middleware/
models/
routes/
utils/


Files:

app.js

server.js

.env

Backend structure follows:
route → controller → model

⚠️ Known Limitations / Tradeoffs

File and folder structure can still be improved further

Some functions handle multiple responsibilities

UI/UX glitches exist, especially on mobile

Token rotation is partially broken in the frontend

Local storage is used to track authentication state

This causes UI flickers or stale auth states

Chart data issue in production:

Bar chart counts are correct

Month mapping is incorrect in deployed environment (e.g., February data appears under other months)

This works correctly in local development

No automated testing

These issues were intentionally documented instead of refactored, in line with the learning-first approach of this portfolio.

🚀 Future Improvements

Improve separation of concerns in frontend and backend logic

Fix frontend authentication state handling (remove local storage dependency)

Resolve production-only chart month mapping bug

Improve mobile responsiveness

Further simplify and standardize folder structure

Add basic test coverage

🌍 Live Demo

Frontend: Deployed on Vercel

Backend: Deployed on Render

👉 https://career-dashboard-mern.vercel.app/

✅ Frontend, backend, and MongoDB Atlas are fully connected and working together.

🔐 Environment Variables
Frontend
VITE_BACKEND_URL=

Backend
PORT=
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
NODE_ENV=
CLIENT_URL=

📚 Learning Outcomes

Built a full MERN authentication flow with refresh token rotation

Implemented protected routes on both frontend and backend

Gained hands-on experience with TanStack Query mutations, caching, and prefetching

Practiced real-world dashboard patterns (charts, pagination, recent activity)

Learned to deploy and connect frontend, backend, and database

Understood tradeoffs between speed, structure, and correctness in learning projects

📎Disclaimer

This is a learning project, not a production-ready application.
The focus is on demonstrating real development progress, architectural understanding, and honest documentation of limitations rather than polish or perfection.




