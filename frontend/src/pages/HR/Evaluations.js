import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  LinearProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Assessment,
  Check,
  Close,
} from '@mui/icons-material';
import { evaluationsAPI } from '../../services/api';

function Evaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState({
    technicalRating: 0,
    communicationRating: 0,
    behavioralRating: 0,
    overallRating: 0,
    notes: '',
    decision: '',
  });

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await evaluationsAPI.getAll();
      setEvaluations(response.data || []);
    } catch (err) {
      console.error('Failed to fetch evaluations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setEvaluationForm({
      technicalRating: 0,
      communicationRating: 0,
      behavioralRating: 0,
      overallRating: 0,
      notes: '',
      decision: '',
    });
    setDialogOpen(true);
  };

  const handleSubmitEvaluation = async () => {
    setSubmitting(true);
    const avgRating = (
      evaluationForm.technicalRating +
      evaluationForm.communicationRating +
      evaluationForm.behavioralRating +
      evaluationForm.overallRating
    ) / 4;

    try {
      await evaluationsAPI.submit(selectedEvaluation.id, {
        hrScore: Math.round(avgRating * 20),
        decision: evaluationForm.decision,
        notes: evaluationForm.notes,
      });

      setEvaluations(evaluations.map(e =>
        e.id === selectedEvaluation.id
          ? {
              ...e,
              status: 'completed',
              hrScore: Math.round(avgRating * 20),
              decision: evaluationForm.decision,
            }
          : e
      ));

      setDialogOpen(false);
    } catch (err) {
      console.error('Failed to submit evaluation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = evaluations.filter(e => e.status === 'pending').length;
  const completedCount = evaluations.filter(e => e.status === 'completed').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          HR Evaluations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and evaluate HR interview candidates
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={600} color="warning.main">
                {pendingCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Evaluations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={600} color="success.main">
                {completedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={600} color="primary">
                {evaluations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Interviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Evaluations Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Candidate</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>AI Score</TableCell>
                <TableCell>HR Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary">No evaluations yet</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {evaluation.candidate.charAt(0)}
                        </Avatar>
                        {evaluation.candidate}
                      </Box>
                    </TableCell>
                    <TableCell>{evaluation.role}</TableCell>
                    <TableCell>{evaluation.date}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgress
                          variant="determinate"
                          value={evaluation.aiScore}
                          sx={{ width: 60, mr: 1 }}
                        />
                        {evaluation.aiScore}%
                      </Box>
                    </TableCell>
                    <TableCell>
                      {evaluation.hrScore ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress
                            variant="determinate"
                            value={evaluation.hrScore}
                            color="secondary"
                            sx={{ width: 60, mr: 1 }}
                          />
                          {evaluation.hrScore}%
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {evaluation.status === 'completed' ? (
                        <Chip
                          label={evaluation.decision}
                          size="small"
                          color={evaluation.decision === 'Passed' ? 'success' : 'error'}
                        />
                      ) : (
                        <Chip label="Pending" size="small" color="warning" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {evaluation.status === 'pending' && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Assessment />}
                          onClick={() => handleEvaluate(evaluation)}
                        >
                          Evaluate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Evaluation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Evaluate {selectedEvaluation?.candidate}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
              Rating Categories
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Technical Skills</Typography>
              <Rating
                value={evaluationForm.technicalRating}
                onChange={(e, v) => setEvaluationForm({ ...evaluationForm, technicalRating: v })}
                size="large"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Communication</Typography>
              <Rating
                value={evaluationForm.communicationRating}
                onChange={(e, v) => setEvaluationForm({ ...evaluationForm, communicationRating: v })}
                size="large"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Behavioral</Typography>
              <Rating
                value={evaluationForm.behavioralRating}
                onChange={(e, v) => setEvaluationForm({ ...evaluationForm, behavioralRating: v })}
                size="large"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Overall Impression</Typography>
              <Rating
                value={evaluationForm.overallRating}
                onChange={(e, v) => setEvaluationForm({ ...evaluationForm, overallRating: v })}
                size="large"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes & Feedback"
              value={evaluationForm.notes}
              onChange={(e) => setEvaluationForm({ ...evaluationForm, notes: e.target.value })}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth>
              <InputLabel>Decision</InputLabel>
              <Select
                value={evaluationForm.decision}
                label="Decision"
                onChange={(e) => setEvaluationForm({ ...evaluationForm, decision: e.target.value })}
              >
                <MenuItem value="Passed">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Check sx={{ color: 'success.main', mr: 1 }} />
                    Passed
                  </Box>
                </MenuItem>
                <MenuItem value="Failed">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Close sx={{ color: 'error.main', mr: 1 }} />
                    Failed
                  </Box>
                </MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitEvaluation}
            disabled={!evaluationForm.decision || submitting}
          >
            {submitting ? <CircularProgress size={20} /> : 'Submit Evaluation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Evaluations;
