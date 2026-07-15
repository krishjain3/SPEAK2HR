import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { CircularProgress, Box } from '@mui/material';

// Layout
const Layout = lazy(() => import('./components/Layout/Layout'));

// Auth Pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));

// Candidate Pages
const CandidateDashboard = lazy(() => import('./pages/Candidate/Dashboard'));
const InterviewSelection = lazy(() => import('./pages/Candidate/InterviewSelection'));
const AIInterview = lazy(() => import('./pages/Candidate/AIInterview'));
const HRInterviewBooking = lazy(() => import('./pages/Candidate/HRInterviewBooking'));
const Assessments = lazy(() => import('./pages/Candidate/Assessments'));
const MyReports = lazy(() => import('./pages/Candidate/MyReports'));
const Profile = lazy(() => import('./pages/Candidate/Profile'));

// HR Pages
const HRDashboard = lazy(() => import('./pages/HR/Dashboard'));
const CandidateList = lazy(() => import('./pages/HR/CandidateList'));
const CandidateDetails = lazy(() => import('./pages/HR/CandidateDetails'));
const SlotManagement = lazy(() => import('./pages/HR/SlotManagement'));
const Evaluations = lazy(() => import('./pages/HR/Evaluations'));
const VideoCall = lazy(() => import('./pages/VideoCall'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const HRApproval = lazy(() => import('./pages/Admin/HRApproval'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const Settings = lazy(() => import('./pages/Admin/Settings'));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle corrupted local storage state
  if (!user || !user.role) {
    logout();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If authenticated but wrong role, push to their own dashboard
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'hr') return <Navigate to="/hr/dashboard" replace />;
    if (user.role === 'candidate') return <Navigate to="/candidate/dashboard" replace />;

    // Safety fallback
    logout();
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

const RoleBasedRedirect = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !user.role) {
    logout();
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'hr') return <Navigate to="/hr/dashboard" replace />;
  if (user.role === 'candidate') return <Navigate to="/candidate/dashboard" replace />;

  logout();
  return <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    }>
      <Routes>
        <Route path="/" element={<RoleBasedRedirect />} />

        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <RoleBasedRedirect /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <RoleBasedRedirect /> : <Register />} />
        <Route path="/forgot-password" element={isAuthenticated ? <RoleBasedRedirect /> : <ForgotPassword />} />

        {/* Candidate Routes */}
        <Route
          path="/candidate"
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <Layout userType="candidate" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CandidateDashboard />} />
          <Route path="interview-selection" element={<InterviewSelection />} />
          <Route path="ai-interview" element={<AIInterview />} />
          <Route path="hr-interview-booking" element={<HRInterviewBooking />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="reports" element={<MyReports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* HR Routes */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <Layout userType="hr" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HRDashboard />} />
          <Route path="candidates" element={<CandidateList />} />
          <Route path="candidates/:id" element={<CandidateDetails />} />
          <Route path="slots" element={<SlotManagement />} />
          <Route path="evaluations" element={<Evaluations />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout userType="admin" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="hr-approval" element={<HRApproval />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Video Call Route */}
        <Route
          path="/video-call/:roomId"
          element={
            <ProtectedRoute allowedRoles={['hr', 'candidate']}>
              <VideoCall />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>
    </Suspense>
  );
}

export default App;
