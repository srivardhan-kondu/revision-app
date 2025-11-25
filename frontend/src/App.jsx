import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Revise from './pages/Revise';
import CalendarPage from './pages/CalendarPage';
import HowItWorks from './pages/HowItWorks';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
            <HowItWorks />
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
        element=
        {
          <ProtectedRoute>
            <Layout>
              <CalendarPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
