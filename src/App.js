import React, { createContext, useCallback, useContext, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { api, getStoredUser, isAuthenticated, logout, setStoredUser, setToken } from './api';
import { LanguageProvider } from './i18n';
import { ThemeProvider } from './theme/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast, { ToastProvider, useToast } from './components/Toast';

import Landing from './legacy-pages/Landing';
import Login from './legacy-pages/Login';
import Register from './legacy-pages/Register';
import Dashboard from './legacy-pages/Dashboard';
import Generator from './legacy-pages/Generator';
import Drafts from './legacy-pages/Drafts';
import CalendarPage from './legacy-pages/CalendarPage';
import Pricing from './legacy-pages/Pricing';
import PaymentCallback from './legacy-pages/PaymentCallback';
import NotFound from './legacy-pages/NotFound';

import DashboardLayout from './components/DashboardLayout';

export const AuthContext = createContext({
  user: null,
  isAuthed: false,
  login: async () => {},
  registerAndLogin: async () => {},
  logout: () => {}
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());

  const handleLogin = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    setToken(data.access_token);
    setStoredUser({ email });
    setUser({ email });
    return data;
  }, []);

  const handleRegister = useCallback(async (payload) => {
    await api.register(payload);
    const data = await api.login(payload.email, payload.password);
    setToken(data.access_token);
    setStoredUser({ email: payload.email, brandName: payload.brand_name || '' });
    setUser({ email: payload.email, brandName: payload.brand_name || '' });
    return data;
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthed: isAuthenticated(),
        login: handleLogin,
        registerAndLogin: handleRegister,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth();
  const location = useLocation();
  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthed } = useAuth();
  if (isAuthed) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const toast = useToast();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state && location.state.message) {
      toast.success(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location, toast]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="generator" element={<Generator />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="payment-callback" element={<PaymentCallback />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
