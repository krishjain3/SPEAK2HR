# Speak2HR Reproducibility Guide

This document provides step-by-step instructions to set up and run the Speak2HR project locally.

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- **Python 3.8+**: [Download Python](https://www.python.org/downloads/)
- **Node.js 16+ & npm**: [Download Node.js](https://nodejs.org/)
- **Google Gemini API Keys**: You need at least one (ideally 5 for load balancing as configured) API key from [Google AI Studio](https://aistudio.google.com/).

---

## ⚡ Quick Start (Windows)

If you are on Windows, you can use the automated script:

1. Double-click **`run_locally.bat`** in the root directory.
2. The script will:
   - Create a Python virtual environment.
   - Install all backend dependencies.
   - Install all frontend dependencies.
   - Create default `.env` files if they don't exist.
3. **Important**: After the first run, open `ML/.env` and add your `GEMINI_API_KEY_1` to `GEMINI_API_KEY_5`.
4. The application will be available at:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend**: [http://localhost:8000](http://localhost:8000)

---

## 🛠️ Manual Setup

### 1. Backend Setup (ML)

1. Navigate to the `ML` directory:
   ```bash
   cd ML
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   - Copy `.env.example` to `.env`.
   - Edit `.env` and provide your Google Gemini API keys.
5. Start the server:
   ```bash
   python main.py
   ```

### 2. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - Copy `.env.example` to `.env`.
   - Ensure `REACT_APP_API_URL` points to `http://localhost:8000`.
4. Start the development server:
   ```bash
   npm start
   ```

---

## 🔍 Verification

To verify the setup is working:
1. Open the frontend in your browser.
2. Navigate to the **Signup** or **Login** page.
3. Check the browser console (F12) to ensure there are no connection errors to the backend.
4. Try uploading a resume or starting a mock interview to ensure the ML models and Gemini API are responsive.

## 📝 Notes
- Ensure your camera and microphone permissions are enabled for the browser.
- The system uses `DeepFace` for emotion detection, which may download model weights (approx. 500MB) on the first run.
