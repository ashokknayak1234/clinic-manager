import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorsPage from './pages/DoctorsPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import MyPrescriptionsPage from './pages/MyPrescriptionsPage';
import MyInvoicesPage from './pages/MyInvoicesPage';
import ProfilePage from './pages/ProfilePage';
import StaffDashboard from './pages/StaffDashboard';
import HealthCheck from './pages/HealthCheck';

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/health" element={<HealthCheck />} />
      
      <Route element={<PublicRoute><Layout /></PublicRoute>}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:doctorId/book" element={<BookAppointmentPage />} />
        <Route path="/appointments" element={<MyAppointmentsPage />} />
        <Route path="/prescriptions" element={<MyPrescriptionsPage />} />
        <Route path="/invoices" element={<MyInvoicesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['ADMIN', 'DOCTOR', 'RECEPTIONIST']}><Layout /></PrivateRoute>}>
        <Route path="/staff" element={<StaffDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;