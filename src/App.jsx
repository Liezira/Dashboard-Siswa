import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { getApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import VerifyEmailPage from './pages/VerifyEmailPage';

// Initialize App Check (ReCaptcha V3)
try {
  initializeAppCheck(getApp(), {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA),
    isTokenAutoRefreshEnabled: true,
  });
} catch (e) {
  // App Check already initialized or env var missing — safe to skip
}

// ─── Protected Route ──────────────────────────────────────────────────────
const ProtectedRoute = ({ user, isLoading, children }) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-700 rounded-full animate-spin"/>
      </div>
    );
  }
  return user ? children : <Navigate to="/" replace/>;
};

// ─── Home Route (redirects to dashboard if already logged in) ─────────────
const HomeRoute = ({ user, isLoading }) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-700 rounded-full animate-spin"/>
      </div>
    );
  }
  return user ? <Navigate to="/dashboard" replace/> : <LandingPage/>;
};

// ─── App Root ─────────────────────────────────────────────────────────────
const AppContent = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomeRoute user={user} isLoading={isLoading}/>}/>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} isLoading={isLoading}>
            <Dashboard user={user}/>
          </ProtectedRoute>
        }
      />
      <Route path="/verify-email" element={<VerifyEmailPage/>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
};

const App = () => (
  <Router>
    <AppContent/>
  </Router>
);

export default App;