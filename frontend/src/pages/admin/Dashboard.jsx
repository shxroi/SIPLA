import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiGrid, FiCalendar, FiUsers, FiMessageSquare, FiSearch, FiLogOut, FiStar } from 'react-icons/fi';
import axios from 'axios';
import Fields from './Fields';
import Bookings from './Bookings';
import BookingRegular from './BookingRegular';
import BookingEvent from './BookingEvent';
import FutsalFields from '../../components/admin/FutsalFields';
import BadmintonFields from '../../components/admin/BadmintonFields';
import BadmintonMembers from '../../components/admin/BadmintonMembers';
import DashboardStats from '../../components/admin/DashboardStats';
import TestimonialManagement from './TestimonialManagement';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  useEffect(() => {
    if (!adminUser.id) {
      navigate('/admin');
      return;
    }
    
    // Cek token validity
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/check-auth', {
          headers: {
            'Authorization': `Bearer ${adminUser.token}`
          }
        });
        
        if (!response.data.valid) {
          localStorage.removeItem('adminUser');
          navigate('/admin');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Jangan logout jika hanya network error
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('adminUser');
          navigate('/admin');
        }
      }
    };
    
    checkAuth();
  }, [navigate, adminUser.id, adminUser.token]);

  const handleLogout = async () => {
    try {
      // Panggil endpoint logout di backend
      await axios.post('http://localhost:3000/api/admin/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Hapus data admin dari localStorage
      localStorage.removeItem('adminUser');
      // Redirect ke halaman login
      navigate('/');
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: <FiGrid size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { 
      id: 'booking', 
      icon: <FiCalendar size={20} />, 
      label: 'Booking', 
      path: '/admin/dashboard/booking',
      submenu: [
        { id: 'booking-regular', label: 'Booking Reguler', path: '/admin/dashboard/booking/regular' },
        { id: 'booking-event', label: 'Booking Event', path: '/admin/dashboard/booking/event' }
      ]
    },
    { 
      id: 'lapangan', 
      icon: <FiGrid size={20} />, 
      label: 'Lapangan', 
      path: '/admin/dashboard/lapangan',
      submenu: [
        { id: 'lapangan-futsal', label: 'Lapangan Futsal', path: '/admin/dashboard/lapangan/futsal' },
        { id: 'lapangan-badminton', label: 'Lapangan Bulutangkis', path: '/admin/dashboard/lapangan/badminton' }
      ]
    },
    { 
      id: 'member', 
      icon: <FiUsers size={20} />, 
      label: 'Member', 
      path: '/admin/dashboard/member',
      submenu: [
        { id: 'member-badminton', label: 'Member Bulutangkis', path: '/admin/dashboard/member/badminton' }
      ]
    },
    { id: 'kritik', icon: <FiMessageSquare size={20} />, label: 'Kritik & Saran', path: '/admin/dashboard/testimonial' },

  ];

  const location = useLocation();
  
  // Set active menu based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin/dashboard') {
      setActiveMenu('dashboard');
    } else if (path.includes('/booking')) {
      setActiveMenu('booking');
    } else if (path.includes('/lapangan')) {
      setActiveMenu('lapangan');
    } else if (path.includes('/member')) {
      setActiveMenu('member');
    } else if (path.includes('/kritik')) {
      setActiveMenu('kritik');
    }
  }, [location.pathname]);

  const bookings = [
    {
      id: 1,
      fieldName: 'Lapangan Futsal A',
      customerName: 'John Doe',
      date: '2024-03-20',
      time: '09:00',
      duration: 2,
      status: 'pending'
    },
    // Add more dummy data as needed
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-blue-600 h-2" style={{ fontSize: '50px' }}>SIPLA</span>
          </div>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Link
                to={item.path}
                className={`w-full flex items-center justify-between px-6 py-3 ${
                  activeMenu === item.id || (activeMenu && activeMenu.startsWith(item.id + '-')) 
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => item.submenu && setActiveMenu(item.id)}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.submenu && (
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      activeMenu === item.id || (activeMenu && activeMenu.startsWith(item.id + '-'))
                        ? 'transform rotate-90'
                        : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                )}
              </Link>
              
              {/* Submenu */}
              {item.submenu && (
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    activeMenu === item.id || (activeMenu && activeMenu.startsWith(item.id + '-'))
                      ? 'max-h-40'
                      : 'max-h-0'
                  }`}
                >
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.path}
                      className={`w-full flex items-center pl-12 pr-6 py-2 ${
                        activeMenu === subItem.id
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveMenu(subItem.id)}
                    >
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Welcome, {adminUser.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FiLogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          <Routes>
            <Route path="/" element={<DashboardStats />} />
            
            {/* Booking Routes */}
            <Route path="/booking" element={<Bookings />} />
            <Route path="/booking/regular" element={<BookingRegular />} />
            <Route path="/booking/event" element={<BookingEvent />} />
            
            {/* Lapangan Routes */}
            <Route path="/lapangan" element={<Fields />} />
            <Route path="/lapangan/futsal" element={<FutsalFields />} />
            <Route path="/lapangan/badminton" element={<BadmintonFields />} />
            
            {/* Member Routes */}
            <Route path="/member" element={
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Member</h1>
                {/* Member component will be added here */}
              </div>
            } />
            <Route path="/member/badminton" element={<BadmintonMembers />} />
            
            {/* Testimonial Route */}
            <Route path="/testimonial" element={<TestimonialManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;