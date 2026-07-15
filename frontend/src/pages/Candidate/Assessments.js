import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Assignment,
  Check,
  Timer,
  History,
  PlayArrow,
} from '@mui/icons-material';
import { assessmentAPI } from '../../services/api';
import { useAuthStore, useAssessmentStore } from '../../store/authStore';

function Assessments() {
  const { user } = useAuthStore();
  const {
    currentAssessment,
    setCurrentAssessment,
    assessmentHistory,
    setAssessmentHistory,
    clearAssessment,
  } = useAssessmentStore();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let timer;
    if (currentAssessment && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentAssessment, timeLeft]);

  const fetchHistory = async () => {
    try {
      const response = await assessmentAPI.getHistory(user?.id);
      const historyData = response.data;
      // Backend returns {assessments: [...]} structure
      const assessments = historyData?.assessments || historyData || [];
      setAssessmentHistory(Array.isArray(assessments) ? assessments : []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setAssessmentHistory([]);
    }
  };

  const startAssessment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await assessmentAPI.generate(
        user?.id,
        user?.targetRole || 'Software Engineer',
        'medium',
        'technical'
      );
      setCurrentAssessment(response.data);
      setAnswers({});
      setTimeLeft(30 * 60);
    } catch (err) {
      setError('Failed to generate assessment. Please try again.');
      console.error('Assessment generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      // Format answers as dictionary {question_id: answer}
      const formattedAnswers = {};
      currentAssessment.questions.forEach((q, index) => {
        formattedAnswers[q.question_id] = answers[index] || '';
      });

      const response = await assessmentAPI.submit(
        currentAssessment.assessment_id,
        user?.id,
        formattedAnswers
      );
      setResult(response.data);
      setShowResult(true);
      clearAssessment();
      fetchHistory();
    } catch (err) {
      setError('Failed to submit assessment. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!currentAssessment) return 0;
    const answered = Object.keys(answers).length;
    return (answered / currentAssessment.questions.length) * 100;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Generating your assessment...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Assessment in progress
  if (currentAssessment) {
    return (
      <Box>
        {/* Header with timer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Daily Assessment
          </Typography>
          <Chip
            icon={<Timer />}
            label={formatTime(timeLeft)}
            color={timeLeft < 300 ? 'error' : 'primary'}
          />
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2">
              {Object.keys(answers).length} / {currentAssessment.questions.length}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={getProgressPercentage()} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Questions */}
        {currentAssessment.questions.map((question, index) => {
          const questionType = question.question_type || question.type || 'short_answer';
          return (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Question {index + 1}
                  </Typography>
                  <Chip
                    label={questionType}
                    size="small"
                    color={
                      questionType === 'mcq' ? 'primary' :
                      questionType === 'short_answer' ? 'secondary' : 'warning'
                    }
                  />
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {question.question}
                </Typography>

                {questionType === 'mcq' && question.options && (
                  <RadioGroup
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  >
                    {question.options.map((option, optIndex) => (
                      <FormControlLabel
                        key={optIndex}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                )}

                {(questionType === 'short_answer' || questionType === 'scenario') && (
                  <TextField
                    fullWidth
                    multiline
                    rows={questionType === 'scenario' ? 4 : 2}
                    placeholder="Type your answer here..."
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <Check />}
          >
            {submitting ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        </Box>
      </Box>
    );
  }

  // Start page
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          Daily Assessments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Test your knowledge and track your progress
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Assignment sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Start Today's Assessment
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                10 questions covering MCQ, Short Answer, and Scenario-based problems.
                Time limit: 30 minutes.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={startAssessment}
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <History sx={{ fontSize: 80, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                View History
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Check your previous assessment results and track your improvement over time.
              </Typography>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setShowHistory(true)}
              >
                View History
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Result Dialog */}
      <Dialog open={showResult} onClose={() => setShowResult(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight={600} textAlign="center">
            Assessment Complete!
          </Typography>
        </DialogTitle>
        <DialogContent>
          {result && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h2" color="primary" fontWeight={700}>
                {Math.round(result.score_percentage || result.score || 0)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {result.correct_answers || 0} / {result.total_questions || 0} correct
              </Typography>
              <Chip
                label={(result.score_percentage || result.score || 0) >= 80 ? 'Excellent' : (result.score_percentage || result.score || 0) >= 60 ? 'Good' : 'Needs Improvement'}
                color={(result.score_percentage || result.score || 0) >= 80 ? 'success' : (result.score_percentage || result.score || 0) >= 60 ? 'warning' : 'error'}
                sx={{ mt: 1 }}
              />
              {result.feedback && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  {result.feedback}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="contained" onClick={() => setShowResult(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Assessment History
          </Typography>
        </DialogTitle>
        <DialogContent>
          {!Array.isArray(assessmentHistory) || assessmentHistory.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              No assessment history yet.
            </Typography>
          ) : (
            <List>
              {assessmentHistory.map((item, index) => {
                const score = item.score_percentage || item.score || 0;
                return (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`Assessment on ${new Date(item.date).toLocaleDateString()}`}
                        secondary={`Score: ${Math.round(score)}% (${item.correct_answers || 0}/${item.total_questions || 0})`}
                      />
                      <Chip
                        label={`${Math.round(score)}%`}
                        size="small"
                        color={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error'}
                      />
                    </ListItem>
                    {index < assessmentHistory.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Assessments;
