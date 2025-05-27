import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookingForm from './pages/BookingForm';
import FieldList from './pages/FieldList';
import FieldDetail from './pages/FieldDetail';
import CustomerBookingForm from './pages/CustomerBookingForm';
import BookingConfirmation from './pages/BookingConfirmation';
import MemberRegister from './pages/MemberRegister';
import MemberLogin from './pages/MemberLogin';
import MemberDashboard from './pages/MemberDashboard';
import MemberProfile from './pages/MemberProfile';
import MemberBooking from './pages/MemberBooking';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import TestimonialManagement from './pages/admin/TestimonialManagement';
import ProtectedRoute from './components/ProtectedRoute';

// Komponen untuk mengatur tampilan navbar
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tampilkan Navbar hanya jika bukan di halaman admin */}
      {!isAdminRoute && <Navbar />}
      
      <main className={!isAdminRoute ? 'container mx-auto px-4 py-8' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/fields" element={<FieldList />} />
          <Route path="/field/:id" element={<FieldDetail />} />
          <Route path="/booking/form" element={<CustomerBookingForm />} />
          <Route path="/booking/confirmation" element={<BookingConfirmation />} />
          
          {/* Member Routes */}
          <Route path="/member/register" element={<MemberRegister />} />
          <Route path="/member/login" element={<MemberLogin />} />
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/member/profile" element={<MemberProfile />} />
          <Route path="/member/booking" element={<MemberBooking />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/testimonials" 
            element={
              <ProtectedRoute>
                <TestimonialManagement />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;