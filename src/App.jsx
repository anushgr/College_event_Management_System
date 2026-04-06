import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AddEventPage from './pages/AddEventPage';
import EditEventPage from './pages/EditEventPage';
import EventDetailsPage from './pages/EventDetailsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />

          {/* Protected Organizer-Only Routes */}
          <Route element={<ProtectedRoute requiredRole="ORGANIZER" />}>
            <Route path="/add-event" element={<AddEventPage />} />
            <Route path="/edit-event/:id" element={<EditEventPage />} />
          </Route>

          {/* Default Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
