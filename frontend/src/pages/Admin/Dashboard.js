import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  People,
  PersonAdd,
  Business,
  Assessment,
  TrendingUp,
  PendingActions,
} from '@mui/icons-material';
import { adminAPI } from '../../services/api';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%', boxShadow: 3 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon, { sx: { color: `${color}.main`, fontSize: 32 } })}
        </Box>
        <Typography variant="h3" fontWeight="bold">
          {value}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingHRApprovals: 0,
    totalCandidates: 0,
    totalInterviews: 0,
    totalHRUsers: 0,
    pendingEvaluations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSystemStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          System overview and management
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<People />}
            color="primary"
            subtitle={`${stats.activeUsers} active users`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="HR Users"
            value={stats.totalHRUsers}
            icon={<Business />}
            color="info"
            subtitle="Active HR personnel"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Candidates"
            value={stats.totalCandidates}
            icon={<PersonAdd />}
            color="success"
            subtitle="Registered candidates"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Interviews"
            value={stats.totalInterviews}
            icon={<Assessment />}
            color="secondary"
            subtitle="Conducted so far"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Evaluations"
            value={stats.pendingEvaluations}
            icon={<TrendingUp />}
            color="error"
            subtitle="Awaiting HR review"
          />
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                {stats.pendingEvaluations > 0 && (
                  <Chip
                    label={`${stats.pendingEvaluations} Evaluations Pending`}
                    color="error"
                    icon={<Assessment />}
                    sx={{ fontSize: '0.9rem', py: 2.5 }}
                  />
                )}
                <Chip
                  label="System Running Normally"
                  color="success"
                  icon={<TrendingUp />}
                  sx={{ fontSize: '0.9rem', py: 2.5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                System Information
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Active Users
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.activeUsers} / {stats.totalUsers}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.activeUsers / stats.totalUsers) * 100}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
