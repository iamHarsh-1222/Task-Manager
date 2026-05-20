# ⚡ TaskFlow — Team Task Manager

A full-stack web application for managing projects and tasks with role-based access control (Admin/Member).

## 🚀 Live Demo
- **Frontend:** https://task-manager-amber-psi.vercel.app/index.html
- **Backend API:** https://team-task-manager-two-bice.vercel.app/

---

## 🎯 Features

- 🔐 **Authentication** — Signup/Login with JWT
- 👥 **Role-Based Access** — Admin & Member roles
- 📁 **Project Management** — Create, view, delete projects (Admin)
- ✅ **Task Management** — Create tasks, assign to members, track status
- 📊 **Dashboard** — Stats overview (total tasks, overdue, completed)
- 🗂️ **Kanban Board** — Todo / In Progress / Done columns
- 📅 **Due Dates & Priority** — Low, Medium, High with overdue detection

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs |
| Deployment | Railway (backend), Netlify (frontend) |

---

## 📂 Project Structure

team-task-manager/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       ├── projects.js
│       └── tasks.js
└── frontend/
├── index.html
├── dashboard.html
├── project.html
├── css/
│   └── style.css
└── js/
├── auth.js
├── dashboard.js
└── project.js

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=supersecretkey123taskmanager
```

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
- Open `frontend/index.html` with **Live Server** (VS Code extension)
- Or just double-click `index.html` in your browser

> Make sure `API` variable in all JS files points to `http://localhost:5000/api` for local dev.

---

## 🌐 Deployment

### Backend → Railway
1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Set root directory to `backend/`
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
5. Deploy — copy the Railway URL

### Frontend → Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `frontend/` folder
3. Done — get your live URL

> Update `const API = 'https://your-railway-url/api'` in all 3 JS files before deploying frontend.

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/users` | Get all users (auth required) |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create project (Admin) |
| GET | `/api/projects` | Get user's projects |
| GET | `/api/projects/:id` | Get single project |
| PUT | `/api/projects/:id` | Update project (Admin) |
| DELETE | `/api/projects/:id` | Delete project (Admin) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/project/:id` | Get tasks by project |
| GET | `/api/tasks/my` | Get my assigned tasks |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task (Admin) |

---

## 👤 Roles

| Feature | Admin | Member |
|---------|-------|--------|
| Create project | ✅ | ❌ |
| Delete project | ✅ | ❌ |
| Create task | ✅ | ✅ |
| Delete task | ✅ | ❌ |
| Update task status | ✅ | ✅ |
| View projects | ✅ | ✅ (if added) |

---

## 📸 Demo Video
[Watch the 3-minute walkthrough →](https://your-loom-link-here.com)

---

## 👨‍💻 Author
**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: you@email.com

---

## 📄 License
MIT License
