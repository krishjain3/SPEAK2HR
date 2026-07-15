import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Email,
  Schedule,
  Info,
} from '@mui/icons-material';
import { adminAPI } from '../../services/api';

function HRApproval() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, user: null, action: null });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pendingRes, allUsersRes] = await Promise.all([
        adminAPI.getPendingHRRequests(),
        adminAPI.getAllUsers(),
      ]);
      setPendingRequests(pendingRes.data);
      setAllUsers(allUsersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (user) => {
    setConfirmDialog({ open: true, user, action: 'approve' });
  };

  const handleReject = async (user) => {
    setConfirmDialog({ open: true, user, action: 'reject' });
  };

  const confirmAction = async () => {
    const { user, action } = confirmDialog;
    try {
      if (action === 'approve') {
        await adminAPI.approveHR(user.id);
        await adminAPI.sendApprovalEmail(user.email, user.name, true);
        setSuccessMessage(`${user.name} has been approved as HR. Email notification sent.`);
      } else {
        await adminAPI.rejectHR(user.id);
        await adminAPI.sendApprovalEmail(user.email, user.name, false);
        setSuccessMessage(`${user.name} has been rejected. Email notification sent.`);
      }
      setConfirmDialog({ open: false, user: null, action: null });
      loadData();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error processing request:', error);
    }
  };

  const hrUsers = allUsers.filter(u => u.role === 'hr');
  const approvedHR = hrUsers.filter(u => u.status === 'approved');
  const rejectedHR = hrUsers.filter(u => u.status === 'rejected');

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          HR Approval Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and approve HR user registrations
        </Typography>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Pending HR Approvals ({pendingRequests.length})
          </Typography>
          {pendingRequests.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No pending HR approval requests
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Registration Date</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingRequests.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email fontSize="small" color="action" />
                          {user.email}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Schedule fontSize="small" color="action" />
                          {user.registeredDate}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApprove(user)}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={() => handleReject(user)}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Approved HR Users ({approvedHR.length})
          </Typography>
          {approvedHR.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No approved HR users yet
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Registration Date</strong></TableCell>
                    <TableCell><strong>Last Login</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {approvedHR.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.registeredDate}</TableCell>
                      <TableCell>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Chip label="Approved" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {rejectedHR.length > 0 && (
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Rejected HR Users ({rejectedHR.length})
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Registration Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rejectedHR.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.registeredDate}</TableCell>
                      <TableCell>
                        <Chip label="Rejected" color="error" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, user: null, action: null })}
      >
        <DialogTitle>
          {confirmDialog.action === 'approve' ? 'Approve HR User' : 'Reject HR User'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {confirmDialog.action} <strong>{confirmDialog.user?.name}</strong> as an HR user?
            {confirmDialog.action === 'approve' && (
              <Box sx={{ mt: 2 }}>
                <Info fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                This user will gain access to HR dashboard and candidate management features.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, user: null, action: null })}>
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            color={confirmDialog.action === 'approve' ? 'success' : 'error'}
            variant="contained"
          >
            {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HRApproval;
