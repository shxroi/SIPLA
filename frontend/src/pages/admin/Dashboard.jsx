import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiCalendar, FiUsers, FiMessageSquare, FiSearch, FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import Fields from './Fields';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  useEffect(() => {
    if (!adminUser.id) {
      navigate('/admin');
    }
  }, [navigate, adminUser.id]);

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
    { id: 'dashboard', icon: <FiGrid size={20} />, label: 'Dashboard' },
    { id: 'booking', icon: <FiCalendar size={20} />, label: 'Booking' },
    { id: 'lapangan', icon: <FiGrid size={20} />, label: 'Lapangan' },
    { id: 'member', icon: <FiUsers size={20} />, label: 'Member' },
    { id: 'kritik', icon: <FiMessageSquare size={20} />, label: 'Kritik & Saran' },
  ];

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
            <img src="/logo.png" alt="SIPLA" className="h-8" />
            <span className="text-xl font-bold text-blue-600">SIPLA</span>
          </div>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center space-x-2 px-6 py-3 ${
                activeMenu === item.id ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
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
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Booking</h3>
                  <p className="text-3xl font-bold text-blue-600">24</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Pendapatan</h3>
                  <p className="text-3xl font-bold text-green-600">Rp 3.600.000</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Member Aktif</h3>
                  <p className="text-3xl font-bold text-purple-600">8</p>
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Booking Terbaru</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lapangan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pemesan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            #{booking.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.fieldName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeMenu === 'lapangan' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Lapangan</h1>
              <Fields />
            </div>
          )}
          {activeMenu === 'booking' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Booking</h1>
              {/* Booking component will be added here */}
            </div>
          )}
          {activeMenu === 'member' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Member</h1>
              {/* Member component will be added here */}
            </div>
          )}
          {activeMenu === 'kritik' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Kritik & Saran</h1>
              {/* Kritik & Saran component will be added here */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;