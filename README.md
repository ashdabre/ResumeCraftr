# 📄 Resume Craftr

**AI-powered resume builder and enhancer** — Create, edit, enhance, save, and download your professional resume with ease. Built with **React** + **FastAPI**.

https://resumecrafter11.netlify.app/

---

## 🚀 Features

- 🖊️ **Live Resume Editor** – Clean UI to write and modify resumes
- 🤖 **AI Enhancement** – Improve resume sections with auto-suggestions
- 📥 **Upload & Parse** – Import existing resume files
- 💾 **Save to Backend** – Stores resumes as JSON files (no database)
- 🧠 **Download Options** – Export enhanced resumes in multiple formats (coming soon)
- 🎨 **Tailwind-styled UI** – Modern and responsive design

---


## 🧑‍💻 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python)
- **State Management:** React Hooks
- **Data Format:** JSON (flat files, no DB)

---

## ⚙️ Setup Instructions

### Backend (FastAPI)

```bash
# Go to backend folder
cd backend

# Create a virtual environment and activate it
python -m venv venv
venv\Scripts\activate  # On Windows

# Install dependencies
pip install fastapi uvicorn

# Run the server
uvicorn app.main:app --reload --port 8004 --app-dir backend

Server runs on: http://localhost:8004

```

### Frontend (React)

```bash

# Go to the frontend (if separated)
cd frontend

# Install dependencies
npm install

# Run the dev server
npm run dev

