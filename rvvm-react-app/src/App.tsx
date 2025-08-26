import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Main Pages
import LandingPage from './pages/LandingPage';
import VisitorEntryPage from './pages/VisitorEntryPage';
import QuickCheckInPage from './pages/QuickCheckInPage';
import VisitorSuccessPage from './pages/VisitorSuccessPage';
import VisitorCheckedInPage from './pages/VisitorCheckedInPage';
import CabEntryPage from './pages/CabEntryPage';
import CabEntrySuccessPage from './pages/CabEntrySuccessPage';
import VisitorRegistrationPagePublic from './pages/VisitorRegistrationPage';
import QRScannerPage from './pages/QRScannerPage';

// Auth Pages
import HostLoginPage from './pages/auth/HostLoginPage';
import SecurityLoginPage from './pages/auth/SecurityLoginPage';
import HostSignupPage from './pages/auth/HostSignupPage';
import SecuritySignupPage from './pages/auth/SecuritySignupPage';

// Dashboard Pages
import HostDashboard from './pages/host/HostDashboard';
import EnhancedSecurityDashboard from './pages/security/EnhancedSecurityDashboard';
import VisitorRegistrationPage from './pages/security/VisitorRegistrationPage';

import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* 🏠 HOME - Landing Page */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* 🚪 PUBLIC VISITOR PAGES */}
                  <Route path="/visitor-entry" element={<VisitorEntryPage />} />
                  <Route path="/quick-checkin" element={<QuickCheckInPage />} />
                  <Route path="/cab-entry" element={<CabEntryPage />} />
                  <Route path="/visitor-registration" element={<VisitorRegistrationPagePublic />} />
                  <Route path="/qr-scanner" element={<QRScannerPage />} />
                  
                  {/* ✅ SUCCESS PAGES */}
                  <Route path="/visitor-success" element={<VisitorSuccessPage />} />
                  <Route path="/visitor-checked-in" element={<VisitorCheckedInPage />} />
                  <Route path="/cab-entry-success" element={<CabEntrySuccessPage />} />
                  
                  {/* 🔐 AUTHENTICATION PAGES */}
                  <Route path="/host-login" element={<HostLoginPage />} />
                  <Route path="/host-signup" element={<HostSignupPage />} />
                  <Route path="/security-login" element={<SecurityLoginPage />} />
                  <Route path="/security-signup" element={<SecuritySignupPage />} />
                  
                  {/* 📊 PROTECTED DASHBOARDS */}
                  <Route path="/host-dashboard" element={
                    <ProtectedRoute>
                      <HostDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/security-dashboard" element={
                    <ProtectedRoute>
                      <EnhancedSecurityDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/security/visitor-registration" element={
                    <ProtectedRoute>
                      <VisitorRegistrationPage />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
