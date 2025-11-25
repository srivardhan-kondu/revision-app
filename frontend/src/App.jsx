// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Revise from './pages/Revise';
import CalendarPage from './pages/CalendarPage';
import HowItWorks from './pages/HowItWorks';

// This runs when no route matches (path="*")
const FallbackRoute = () => {
  const { user } = useAuth();
  // If user is logged in → dashboard; otherwise → login
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
};

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Default landing */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/how-it-works"
        element={
          <ProtectedRoute>
            <Layout>
              <HowItWorks />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            <Layout>
              <Learn />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/revise"
        element={
          <ProtectedRoute>
            <Layout>
              <Revise />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Layout>
              <CalendarPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all: any unknown URL → send user home */}
      <Route path="*" element={<FallbackRoute />} />
    </Routes>
  );
};

export default App;
