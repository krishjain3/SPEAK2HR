# Speak2HR Frontend

AI-Powered Interview Platform built with React.js

## Features

### Candidate Features
- **Registration & Profile Management**: Create account with skills, experience, and target role
- **AI Interview**: 8-level progressive interview with video/audio recording
  - Real-time emotion analysis
  - Speech-to-text transcription
  - Technical and behavioral evaluation
  - Instant feedback and scoring
- **HR Interview Booking**: Schedule live interviews with HR team
- **Daily Assessments**: Take assessments with MCQ, short answer, and scenario-based questions
- **Reports & Analytics**: View interview results, weekly performance, and download PDF reports

### HR Features
- **Dashboard**: Overview of candidates, interviews, and performance metrics
- **Candidate Management**: View all candidates with filtering and search
- **Detailed Candidate Profiles**: Score breakdowns, interview history, and HR notes
- **Slot Management**: Create and manage interview availability
- **Evaluations**: Rate and provide feedback for HR interviews

## Tech Stack

- **React.js 18** - UI Framework
- **Material-UI (MUI)** - Component Library
- **React Router v6** - Routing
- **Zustand** - State Management
- **Chart.js** - Data Visualization
- **Axios** - HTTP Client
- **React Webcam** - Video Recording

## Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running on http://localhost:8000

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure the API URL in `.env`:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

## Running the Application

### Development Mode
```bash
npm start
```
Opens at http://localhost:3000

### Production Build
```bash
npm run build
```
Creates optimized build in `build/` folder

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout/
│   │       └── Layout.js          # Main layout with sidebar
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.js           # Login page
│   │   │   └── Register.js        # Registration page
│   │   ├── Candidate/
│   │   │   ├── Dashboard.js       # Candidate dashboard
│   │   │   ├── InterviewSelection.js  # Interview type selection
│   │   │   ├── AIInterview.js     # AI interview with recording
│   │   │   ├── HRInterviewBooking.js  # Slot booking
│   │   │   ├── Assessments.js     # Daily assessments
│   │   │   ├── MyReports.js       # Reports and analytics
│   │   │   └── Profile.js         # User profile
│   │   └── HR/
│   │       ├── Dashboard.js       # HR dashboard
│   │       ├── CandidateList.js   # All candidates
│   │       ├── CandidateDetails.js # Detailed candidate view
│   │       ├── SlotManagement.js  # Interview slots
│   │       └── Evaluations.js     # HR evaluations
│   ├── services/
│   │   └── api.js                 # API service layer
│   ├── store/
│   │   └── authStore.js           # Zustand stores
│   ├── App.js                     # Main app with routing
│   └── index.js                   # Entry point
├── package.json
└── README.md
```

## API Integration

The frontend connects to the FastAPI backend with these endpoints:

### Resume APIs
- `POST /api/resume/upload` - Upload and analyze resume
- `POST /api/job/match` - Match resume with job description
- `POST /api/skill-gap/analyze` - Analyze skill gaps

### Interview APIs
- `POST /api/interview/generate-questions` - Generate interview questions
- `POST /api/interview/evaluate-response` - Evaluate video/audio response
- `GET /api/interview/session/{session_id}` - Get session summary
- `POST /api/interview/generate-report` - Generate PDF report

### Assessment APIs
- `POST /api/assessment/generate` - Generate daily assessment
- `POST /api/assessment/submit` - Submit assessment answers
- `GET /api/assessment/history/{user_id}` - Get assessment history

## Usage

### Demo Login
- **Candidate**: Use any email (e.g., `candidate@example.com`)
- **HR**: Use any email with "hr@" (e.g., `hr@company.com`)

### AI Interview Flow
1. Go to "Start Interview"
2. Select "AI Interview"
3. Configure skills and upload resume (optional)
4. Answer 8 progressive questions on video
5. Receive instant feedback after each question
6. View comprehensive report at the end

### HR Interview Booking
1. Go to "Start Interview"
2. Select "HR Interview"
3. Choose an available slot
4. Confirm booking
5. Receive confirmation with meeting details

## Browser Permissions

The AI Interview requires:
- Camera access (for video recording)
- Microphone access (for audio recording)

Make sure to allow these permissions when prompted.

## Customization

### Theme
Modify the theme in `src/index.js`:
```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    // ...
  },
});
```

### API URL
Update in `.env`:
```
REACT_APP_API_URL=https://your-api-url.com
```

## Troubleshooting

### Camera/Mic not working
- Check browser permissions
- Ensure no other app is using the camera
- Try a different browser

### API connection errors
- Verify backend is running on correct port
- Check CORS configuration in backend
- Verify API URL in `.env`

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

## License

MIT
