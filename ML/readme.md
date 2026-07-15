# Speak2HR - ML-Enhanced AI Interview System

## 🎯 Overview

Speak2HR is an advanced AI-powered interview assessment system featuring:
- **DeepFace Emotion Analysis** - Real-time facial emotion detection during interviews
- **Progressive 8-Level Question System** - HR Basic → Tech Expert progression
- **Multi-API Parallel Processing** - 5 independent Gemini API keys to prevent exhaustion
- **Daily Unique Assessments** - Never repeat questions using seed-based generation
- **Comprehensive PDF Reports** - Detailed analysis with email delivery
- **Video + Audio Analysis** - Both modalities analyzed per question

## 🚀 Key ML Features

### 1. **DeepFace Emotion Analysis**
```python
# Analyzes 7 emotions: happy, sad, angry, fear, surprise, disgust, neutral
- Extracts 2 frames per second from video
- Per-frame emotion detection
- Dominant emotion calculation
- Engagement score (0-1)
- Stress indicator detection
```

### 2. **Progressive Question Levels**
```
Level 1: HR Basic (weight: 0.8)
Level 2: HR Behavioral (weight: 0.9)
Level 3: Tech Simple (weight: 1.0)
Level 4: Tech Basic (weight: 1.1)
Level 5: Tech Intermediate (weight: 1.3)
Level 6: Tech Advanced (weight: 1.4)
Level 7: Tech Expert (weight: 1.6)
Level 8: Problem Solving (weight: 1.7)
```

### 3. **Multi-Dimensional Scoring**
- **Relevance Score** (0-1): Answer relevance to question
- **Clarity Score** (0-1): Communication clarity
- **Confidence Score** (0-1): Detected confidence level
- **Technical Accuracy** (0-1): Correctness of technical content
- **Keyword Usage** (0-1): Use of expected technical terms
- **Emotion Score** (0-1): Positive emotion ratio & engagement
- **Weighted Score**: Base score × level weight

### 4. **Daily Unique Questions**
```python
# Ensures variety using:
- MD5 hash seed generation (user_id + date + category + random)
- Question history tracking (last 100 questions)
- Explicit avoidance of previously asked topics
- 40% MCQ, 30% Short Answer, 30% Scenario-based
```

### 5. **Parallel API Processing**
```python
# 5 independent API keys:
API_KEYS = {
    "primary": Question generation (Level 1-3)
    "secondary": Question generation (Level 4-8)
    "tertiary": Audio response evaluation
    "assessment": Daily assessment questions
    "emotion": Video transcription & analysis
}
```

## 📁 Project Structure

```
speak2hr/
├── app_ml_enhanced.py          # Main FastAPI application
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
├── .env                       # Your actual API keys (create this)
├── cv_job_maching.model       # Doc2Vec model (required)
│
├── temp_files/                # Temporary file storage
├── recordings/                # Audio recordings
├── videos/                    # Video recordings
├── profiles/                  # User profiles (JSON)
├── reports/                   # Generated PDF reports
├── assessments/               # Daily assessment data
├── emotion_analysis/          # Emotion analysis results
└── daily_questions/           # Question history per user
```

## 🛠️ Setup Instructions

### Step 1: Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### Step 2: Get API Keys

You need **5 Google Gemini API keys** for optimal performance:

1. Go to https://makersuite.google.com/app/apikey
2. Create 5 API keys (you can use same Google account)
3. Copy each key to your `.env` file

### Step 3: Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual keys
nano .env  # or use any text editor
```

Example `.env`:
```
GOOGLE_API_KEY_1=AIzaSyAbc123...
GOOGLE_API_KEY_2=AIzaSyAdef456...
GOOGLE_API_KEY_3=AIzaSyAghi789...
GOOGLE_API_KEY_4=AIzaSyAjkl012...
GOOGLE_API_KEY_5=AIzaSyAmno345...

EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Step 4: Download Doc2Vec Model

You need the `cv_job_maching.model` file for resume matching:

```bash
# Place the model file in the project root directory
# The model should be trained on job descriptions and resumes
```

### Step 5: Run the Application

```bash
# Start the FastAPI server
python app_ml_enhanced.py

# Or use uvicorn directly:
uvicorn app_ml_enhanced:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📡 API Endpoints

### Interview Flow

#### 1. Generate Questions
```http
POST /api/interview/generate-questions
Content-Type: application/json

{
  "job_description": "Software Engineer role...",
  "role": "Software Engineer",
  "user_id": "user123",
  "num_questions": 8
}

Response:
{
  "questions": [
    {
      "question_id": "uuid_1_0",
      "question": "Tell me about yourself",
      "category": "hr",
      "difficulty": "easy",
      "level": 1,
      "level_name": "HR Basic",
      "order": 1,
      "weight": 0.8
    },
    ...
  ],
  "session_id": "uuid",
  "total_questions": 8
}
```

#### 2. Evaluate Response (Video + Audio)
```http
POST /api/interview/evaluate-response
Content-Type: multipart/form-data

Form Data:
- session_id: "uuid"
- question_id: "uuid_1_0"
- question: "Tell me about yourself"
- level: 1
- level_name: "HR Basic"
- category: "hr"
- difficulty: "easy"
- weight: 0.8
- expected_keywords: '["experience", "skills", "background"]'
- video_file: video.mp4
- audio_file: audio.wav

Response:
{
  "question_id": "uuid_1_0",
  "transcription": "I am a software engineer...",
  "emotion_analysis": {
    "dominant_emotion": "happy",
    "emotion_distribution": {
      "happy": 0.6,
      "neutral": 0.3,
      "surprise": 0.1
    },
    "engagement_score": 0.85,
    "stress_indicators": []
  },
  "relevance_score": 0.9,
  "clarity_score": 0.85,
  "confidence_score": 0.88,
  "technical_accuracy_score": 0.80,
  "keyword_usage_score": 0.75,
  "emotion_score": 0.82,
  "weighted_score": 0.68,  # (avg_score * weight)
  "session_id": "uuid"
}
```

#### 3. Get Session Summary
```http
GET /api/interview/session/{session_id}

Response:
{
  "session_id": "uuid",
  "total_questions": 8,
  "average_score": 0.82,
  "weighted_average_score": 0.95,
  "category_scores": {
    "hr": 0.85,
    "technical": 0.80
  },
  "difficulty_scores": {
    "easy": 0.90,
    "medium": 0.82,
    "hard": 0.75
  },
  "overall_emotion": "happy",
  "stress_level": "Low",
  "recommendation": "Excellent performance!"
}
```

#### 4. Generate & Email Report
```http
POST /api/interview/generate-report
Content-Type: application/json

{
  "session_id": "uuid",
  "user_id": "user123",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "role": "Software Engineer",
  "send_email": true
}

Response:
{
  "success": true,
  "report_filename": "interview_report_uuid_timestamp.pdf",
  "download_url": "/api/interview/download-report/...",
  "email_sent": true
}
```

### Daily Assessments

#### 1. Generate Assessment
```http
POST /api/assessment/generate
Content-Type: application/json

{
  "user_id": "user123",
  "role": "Software Engineer",
  "difficulty": "medium",  // easy, medium, hard
  "category": "mixed",     // hr, technical, mixed
  "num_questions": 5
}

Response:
{
  "assessment_id": "uuid",
  "questions": [
    {
      "question_id": "uuid_0",
      "question": "What is polymorphism?",
      "category": "technical",
      "difficulty": "medium",
      "question_type": "mcq",
      "options": ["A", "B", "C", "D"],
      "expected_keywords": ["inheritance", "override"],
      "time_limit_seconds": 60
    },
    ...
  ],
  "total_questions": 5,
  "date": "2025-11-12"
}
```

#### 2. Submit Assessment
```http
POST /api/assessment/submit
Content-Type: application/json

{
  "assessment_id": "uuid",
  "user_id": "user123",
  "answers": {
    "uuid_0": "Option A",
    "uuid_1": "Polymorphism allows objects..."
  }
}

Response:
{
  "assessment_id": "uuid",
  "user_id": "user123",
  "total_questions": 5,
  "correct_answers": 4,
  "score_percentage": 80.0,
  "category_breakdown": {
    "technical": {
      "total_questions": 3,
      "average_score": 0.85,
      "percentage": 85.0
    }
  },
  "detailed_feedback": [...],
  "improvement_areas": ["Focus on HR questions"]
}
```

#### 3. Get Assessment History
```http
GET /api/assessment/history/{user_id}?limit=10

Response:
{
  "user_id": "user123",
  "total_assessments": 15,
  "assessments": [
    {
      "assessment_id": "uuid",
      "date": "2025-11-12",
      "score_percentage": 80.0,
      "total_questions": 5,
      "correct_answers": 4
    },
    ...
  ]
}
```

## 🧠 ML Model Details

### DeepFace Configuration
```python
DeepFace.analyze(
    frame,
    actions=['emotion'],
    enforce_detection=False,  # Don't fail if no face detected
    detector_backend='opencv'  # Fast detector
)
```

**Detected Emotions:**
- happy
- sad
- angry
- fear
- surprise
- disgust
- neutral

**Engagement Score Calculation:**
```python
positive_score = happy + surprise
negative_score = sad + angry + fear + disgust
neutral_score = neutral

engagement = (positive * 1.0) + (neutral * 0.5) - (negative * 0.3)
engagement = clamp(engagement, 0.0, 1.0)
```

### Doc2Vec Model
- **Purpose**: Resume-Job Description matching
- **Architecture**: Doc2Vec (gensim)
- **Input**: Cleaned text (alphanumeric only)
- **Output**: Similarity percentage (0-100)

### Gemini 2.5 Flash
- **Model**: `gemini-2.5-flash`
- **Uses**:
  - Question generation
  - Response evaluation
  - Audio transcription
  - Assessment evaluation
- **Rate Limiting**: Handled via multiple API keys

## 📊 Scoring System

### Base Score Calculation
```python
base_score = (
    relevance * 0.25 +
    clarity * 0.20 +
    confidence * 0.15 +
    technical_accuracy * 0.20 +
    keyword_usage * 0.10 +
    emotion_score * 0.10
)
```

### Weighted Score
```python
weighted_score = base_score * level_weight

# Example:
# Level 1 (HR Basic): base_score * 0.8
# Level 8 (Problem Solving): base_score * 1.7
```

### Final Rating
- **Excellent**: ≥ 0.85
- **Good**: 0.75 - 0.84
- **Average**: 0.60 - 0.74
- **Needs Improvement**: < 0.60

## 🎨 Report Features

Generated PDF reports include:

1. **Candidate Information**
   - Name, Role, Date, Session ID

2. **Overall Performance Summary**
   - All metric scores with ratings
   - Overall dominant emotion
   - Category-wise breakdown

3. **Question-by-Question Analysis**
   - Question text with level & difficulty
   - All scores in table format
   - Emotion analysis details
   - Stress indicators
   - Transcription
   - Strengths & improvements

4. **Final Recommendations**
   - Personalized based on weak areas
   - Level progression analysis
   - Emotion-based suggestions

## 🔒 Security Notes

1. **API Keys**: Never commit `.env` file to git
2. **File Cleanup**: Temporary files auto-deleted after processing
3. **Data Privacy**: User data stored locally, no external sharing
4. **Email**: Use app-specific password, not main password

## 🐛 Troubleshooting

### Issue: "API key not found"
**Solution**: Check your `.env` file has all 5 keys properly set

### Issue: "DeepFace model download failed"
**Solution**: 
```bash
python -c "from deepface import DeepFace; DeepFace.build_model('Emotion')"
```

### Issue: "Doc2Vec model not found"
**Solution**: Ensure `cv_job_maching.model` is in project root

### Issue: "Email not sending"
**Solution**: 
- Use Gmail App Password, not regular password
- Enable "Less secure app access" (if needed)

### Issue: "Rate limit exceeded"
**Solution**: 
- Add more API keys
- Increase delay between requests
- Use different Google accounts for keys

## 📈 Performance Optimization

1. **Parallel Processing**: 5 API keys handle different tasks simultaneously
2. **Frame Extraction**: 2 FPS (adjustable) balances speed vs accuracy
3. **Caching**: Question history prevents duplicate generation
4. **Async Operations**: Emotion analysis runs in background

## 🔄 Workflow Summary

```
1. User uploads resume → Resume analysis
2. System generates 8-level progressive questions
3. For each question:
   a. User records video + audio response
   b. DeepFace analyzes emotions from video frames
   c. Gemini transcribes audio
   d. Gemini evaluates response quality
   e. System calculates weighted scores
4. After all questions:
   a. Generate comprehensive PDF report
   b. Email report to user
   c. Display results in dashboard
5. Daily assessments:
   a. Generate unique questions (never repeat)
   b. Evaluate answers (MCQ + AI grading)
   c. Track progress over time
```

## 📞 Support

For issues or questions:
- Check `/health` endpoint for system status
- Review logs in console output
- Ensure all dependencies installed correctly
- Verify API keys are valid and have quota

