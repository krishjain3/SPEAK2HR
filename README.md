# Speak2HR - AI-Powered Interview Assessment System

## 🎯 Overview

Speak2HR is an advanced, comprehensive AI-powered platform designed to revolutionize the interview process for both candidates and HR professionals. It bridges the gap between traditional interviews and modern AI capabilities by offering a progressive 8-level interview system with real-time video, audio, and emotion analysis.

The system is composed of two main parts:
1. **Frontend**: A React.js application offering a seamless UI arrayed with dashboards for candidates and HR personnel.
2. **Backend (ML-Enhanced)**: A FastAPI application integrated with Google Gemini API, DeepFace for emotion detection, and Doc2Vec for resume matching.

## ✨ Key Features

### For Candidates
- **Progressive AI Interviews**: An 8-level interview progression (HR Basic to Tech Expert) with customized questions.
- **Multimodal Analysis**: Both video (emotions, engagement via DeepFace) and audio (transcription, content analysis via Gemini) are analyzed per question.
- **Daily Unique Assessments**: Seed-based generation ensures you never face the exact same questions twice. Includes MCQ, short-answer, and scenario-based formats.
- **Comprehensive Reports**: Detailed analysis with PDF reports and multi-dimensional scoring (Relevance, Clarity, Confidence, Technical Accuracy, Keyword Usage, Emotion).
- **HR Interview Booking**: Schedule live interviews with the HR team directly through the platform.

### For HR Professionals
- **Candidate Management Dashboard**: Overview of candidates, filterable views, and detailed performance metrics.
- **Detailed Profiles**: In-depth breakdowns of candidate scores, interview history, and HR-specific notes.
- **Slot Management**: Create, organize, and manage availability for direct HR interviews.
- **Evaluations**: Review candidate AI-interview reports and provide customized feedback.

## 🚀 Tech Stack

### Frontend
- **React.js 18** (UI Framework)
- **Material-UI (MUI)** (Component Library)
- **React Router v6**, **Zustand** (State Management)
- **React Webcam** (Video Recording), **Chart.js**
- **Axios** (HTTP Client)

### Backend (ML & AI)
- **FastAPI** (Python Web Framework)
- **DeepFace** (Real-time facial emotion & engagement analysis)
- **Gensim (Doc2Vec)** (Resume to Job Description matching)
- **Google Gemini 2.5 Flash** (Question generation, response evaluation, API parallel processing)
- **SQLite** (Database)

## 📁 Project Structure

```
speak2hr/
├── frontend/             # React.js web application
│   ├── src/              # React components, pages, services
│   ├── public/           # Static files
│   └── package.json      # Node dependencies
├── ML/                   # FastAPI backend & ML models
│   ├── app_ml_enhanced.py# Main application entry point
│   ├── database.py       # DB operations
│   ├── requirements.txt  # Python dependencies
│   ├── .env              # API keys and secrets config
│   └── cv_job_maching.model # Pre-trained Doc2Vec model
└── README.md             # Project documentation (this file)
```

## 🛠️ Getting Started

To run the full application locally, you'll need to start both the Python backend and the React frontend.

### Prerequisites
- Python 3.8+
- Node.js 16+ and npm (or yarn)
- 5 Google Gemini API keys (for parallel load balancing)

---

### Step 1: Backend Setup (ML/FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd ML
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   ```

3. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your **5 Google Gemini API keys** and email credentials to the `.env` file for generating questions, evaluations, and sending reports.

5. Ensure the Local Models are present:
   - Make sure `cv_job_maching.model` is in the `ML` directory.

6. Start the backend Server:
   ```bash
   python main.py
   # Or using uvicorn:
   # uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   The API will be available at `http://localhost:8000`

---

### Step 2: Frontend Setup (React)

1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Set the API URL to match your backend:
     ```env
     REACT_APP_API_URL=http://localhost:8000
     ```

4. Start the frontend development server:
   ```bash
   npm start
   ```
   The application will open automatically at `http://localhost:3000`

## 🔒 Security & Privacy Notes

- Make sure to give the browser **Camera** and **Microphone** permissions when prompted for the AI interview.
- Temporary video and audio recordings are auto-deleted after processing.
- Do not commit your `.env` files containing API keys and email application passwords.
