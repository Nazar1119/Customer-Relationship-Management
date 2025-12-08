# 📘 Customer Relationship Management – DeviceCare  
A full-stack CRM system for managing clients, devices, repair requests, diagnostics, employees, and reporting.

This project is built as a modern microservice architecture featuring:

- **Frontend:** React + Vite  
- **Backend #1 (.NET Core):** Auth, Clients, Devices, Admin Users  
- **Backend #2 (FastAPI):** Repair Requests, Diagnostics, Reports  
- **Infrastructure:** Docker with NGINX reverse proxy  
- **Deployment:** Local Docker / Render / GCP Cloud Run  
- **Database:** Two separate databases (DB1 for .NET, DB2 for FastAPI)

---

## 🚀 Features

### 🔐 Authentication & Authorization (.NET)
- User login (JWT)
- Role management (Admin / User)
- Session handling
- Access-level restrictions for Admin views

### 👥 Clients Module (.NET)
- Create, edit, delete clients  
- Soft delete & full CRUD  
- Phone, email, status, address fields  
- Search & filter  
- Linked devices for each client  

### 💻 Devices Module (.NET)
- Add devices to a specific client  
- Edit & delete devices  
- Model, serial number, device type, notes  
- Device filtering via special endpoint:  

### 🛠️ Repair Requests (FastAPI)
- Create new repair requests  
- Status workflow: `new → in_progress → completed`  
- Client & device relationship  
- Request history  
- FastAPI task logging  

### 🔎 Diagnostics (FastAPI)
- Add diagnostics results for requests  
- States: ok / fail / waiting  
- Notes & timestamps  
- Fetch by ID  
- Analytics-ready data structure  

### 📊 Reports (FastAPI)
- Generate reports for specified time ranges  
- Summary JSON field with validation  
- Fetch reports by ID  
- Automatic date validation  
- Flexible JSON summary input  

### 👨‍💼 Admin Users (.NET)
- Create employees  
- Edit employee info & departments  
- Assign Admin/User roles  
- Delete employees  
- System activity management  

### 🧭 UI (React + Vite)
A full CRM-style dashboard:

- Sidebar navigation  
- Clients → linked devices → editing  
- Requests table with actions  
- Diagnostics dashboard  
- Reports generation panel  
- Admin employees page  
- Clean & modern dark UI  
- Instant refresh using React Query  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, React Router, TanStack Query |
| Backend #1 | .NET Core Web API |
| Backend #2 | Python FastAPI |
| Databases | SQL (DB1 for .NET), SQL (DB2 for FastAPI) |
| Deployment | Docker, Render, GCP Cloud Run |
| Proxy | NGINX reverse proxy |
| Auth | JWT Tokens |
| Styling | Custom CSS, modern dashboard layout |

---

## 🏗️ Project Architecture

repo-root/
├── frontend/ # React + Vite + Dockerfile + nginx.conf
├── crm/ # .NET Core (Auth, Clients, Devices, Admin)
├── backend-fastapi/ # FastAPI (Requests, Diagnostics, Reports)
└── README.md

Two backend services communicate only through the frontend.

---

## 🐳 Docker Setup

### ✔ Build local image:
```bash
docker build -t devicecare-frontend ./frontend
