// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import InstagramDashboard from './pages/InstagramDashboard';
import InstagramCallback from './pages/InstagramCallback';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AIDashboard from './pages/AIDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/instagram" element={<InstagramDashboard />} />
              <Route path="/instagram/callback" element={<InstagramCallback />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ai" element={<AIDashboard />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;