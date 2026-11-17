import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

// Public pages
import HomePage from './pages/public/HomePage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import ActivitiesPage from './pages/public/ActivitiesPage.jsx';
import ActivityDetailPage from './pages/public/ActivityDetailPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import RegisterPage from './pages/public/RegisterPage.jsx';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage.jsx';

// Volunteer pages
import VolunteerLayout from './layouts/VolunteerLayout.jsx';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard.jsx';
import BrowseActivities from './pages/volunteer/BrowseActivities.jsx';
import MyActivities from './pages/volunteer/MyActivities.jsx';
import MyAttendance from './pages/volunteer/MyAttendance.jsx';
import MyCertificates from './pages/volunteer/MyCertificates.jsx';
import VolunteerProfile from './pages/volunteer/VolunteerProfile.jsx';

// Admin pages
import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageVolunteers from './pages/admin/ManageVolunteers.jsx';
import VolunteerDetail from './pages/admin/VolunteerDetail.jsx';
import ManageActivities from './pages/admin/ManageActivities.jsx';
import Applications from './pages/admin/Applications.jsx';
import AttendanceManagement from './pages/admin/AttendanceManagement.jsx';
import CertificatesAdmin from './pages/admin/CertificatesAdmin.jsx';
import ContactMessages from './pages/admin/ContactMessages.jsx';
import Reports from './pages/admin/Reports.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/activities/:id" element={<ActivityDetailPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Volunteer Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute role="volunteer"><VolunteerLayout /></ProtectedRoute>}>
        <Route index element={<VolunteerDashboard />} />
        <Route path="browse" element={<BrowseActivities />} />
        <Route path="my-activities" element={<MyActivities />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="certificates" element={<MyCertificates />} />
        <Route path="profile" element={<VolunteerProfile />} />
      </Route>

      {/* Admin Dashboard */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="volunteers" element={<ManageVolunteers />} />
        <Route path="volunteers/:id" element={<VolunteerDetail />} />
        <Route path="activities" element={<ManageActivities />} />
        <Route path="applications" element={<Applications />} />
        <Route path="attendance" element={<AttendanceManagement />} />
        <Route path="certificates" element={<CertificatesAdmin />} />
        <Route path="contact" element={<ContactMessages />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
