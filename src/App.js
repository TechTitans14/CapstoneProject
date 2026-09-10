import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard'; // Admin Dashboard
import DoctorDashboard from './components/DoctorDashboard';
import PatientRegistration from './components/PatientRegistration';
import BookAppointment from './components/BookAppointment';
import ManageAppointments from './components/ManageAppointments';
import ScheduleConsultation from './components/ScheduleConsultation';
import NewConsultation from './components/NewConsultation';
import IssuePrescription from './components/IssuePrescription';
import UserManagement from './components/UserManagement';
import GenerateReports from './components/GenerateReports';
import ReceptionistDashboard from './components/ReceptionistDashboard';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      <Route path="/dashboard" element={
        <PrivateRoute>
          {/* Show different dashboard based on role */}
          {user?.role === 'Doctor' ? <DoctorDashboard /> : 
           user?.role === 'Admin' ? <AdminDashboard /> : 
            user?.role === 'Receptionist' ? <ReceptionistDashboard /> : 
           <Dashboard />}
        </PrivateRoute>
      } />
      
      <Route path="/register-patient" element={
        <PrivateRoute roles={['Receptionist', 'Admin']}>
          <PatientRegistration />
        </PrivateRoute>
      } />
      
      <Route path="/book-appointment" element={
        <PrivateRoute roles={['Receptionist', 'Admin']}>
          <BookAppointment />
        </PrivateRoute>
      } />
      
      <Route path="/manage-appointments" element={
        <PrivateRoute roles={['Receptionist', 'Admin']}>
          <ManageAppointments />
        </PrivateRoute>
      } />
      
      <Route path="/schedule-consultation" element={
        <PrivateRoute roles={['Doctor']}>
          <ScheduleConsultation />
        </PrivateRoute>
      } />
      
      <Route path="/new-consultation" element={
        <PrivateRoute roles={['Doctor']}>
          <NewConsultation />
        </PrivateRoute>
      } />
      
      <Route path="/issue-prescription" element={
        <PrivateRoute roles={['Doctor']}>
          <IssuePrescription />
        </PrivateRoute>
      } />
      
      <Route path="/user-management" element={
        <PrivateRoute roles={['Admin']}>
          <UserManagement />
        </PrivateRoute>
      } />
      
      <Route path="/generate-reports" element={
        <PrivateRoute roles={['Admin', 'Doctor']}>
          <GenerateReports />
        </PrivateRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
