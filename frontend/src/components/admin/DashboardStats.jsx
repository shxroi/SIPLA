import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiCalendar, FiClock, FiDollarSign, FiActivity, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';

const DashboardStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeMembers: 0,
    availableFields: 0,
    todayBookings: 0,
    pendingBookings: 0
  });
  const [bookingsByType, setBookingsByType] = useState([]);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [fieldUtilization, setFieldUtilization] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [error, setError] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Ambil token dari localStorage
        const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
        
        if (!adminUser || !adminUser.token) {
          setError('Token tidak ditemukan, silahkan login kembali');
          setLoading(false);
          return;
        }

        const authToken = adminUser.token;

        // Menampilkan token untuk debugging
        console.log('Using auth token:', authToken);

        // Fetch dashboard stats
        const statsResponse = await axios.get('http://localhost:3000/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        setStats({
          totalBookings: statsResponse.data.totalBookings,
          totalRevenue: statsResponse.data.totalRevenue,
          activeMembers: statsResponse.data.activeMembers,
          availableFields: statsResponse.data.availableFields,
          todayBookings: statsResponse.data.todayBookings || 0,
          pendingBookings: statsResponse.data.pendingBookings || 0
        });

        setBookingsByType(statsResponse.data.bookingsByType || []);
        setRevenueByMonth(statsResponse.data.revenueByMonth || []);
        setFieldUtilization(statsResponse.data.fieldUtilization || []);

        // Fetch recent bookings
        try {
          const bookingsResponse = await axios.get('http://localhost:3000/api/booking/admin', {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            },
            params: {
              limit: 5,
              page: 1
            }
          });
          
          if (bookingsResponse.data && bookingsResponse.data.data) {
            setRecentBookings(bookingsResponse.data.data);
          }
        } catch (bookingError) {
          console.error('Error fetching recent bookings:', bookingError);
          // Tidak perlu menampilkan error untuk booking, cukup tampilkan data kosong
          setRecentBookings([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Gagal memuat data statistik');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FiCalendar className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Booking</p>
              <p className="text-xl font-bold">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FiDollarSign className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendapatan</p>
              <p className="text-xl font-bold">Rp {stats.totalRevenue.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <FiUsers className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Aktif</p>
              <p className="text-xl font-bold">{stats.activeMembers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-500 mr-4">
              <FiActivity className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Booking Hari Ini</p>
              <p className="text-xl font-bold">{stats.todayBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Booking Terbaru</h2>
          <Link to="/admin/dashboard/booking" className="text-blue-600 hover:text-blue-800 text-sm">
            Lihat Semua
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lapangan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemesan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.lapangan_nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.nama_pemesan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.jam_mulai} - {booking.jam_selesai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status_booking === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status_booking === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status_booking === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {booking.status_booking}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/booking/${booking.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada data booking terbaru
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking by Type Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Booking Berdasarkan Tipe</h2>
          <div className="h-64">
            {bookingsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} booking`, 'Jumlah']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Tidak ada data booking</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Revenue by Month Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Pendapatan Bulanan</h2>
          <div className="h-64">
            {revenueByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueByMonth}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Pendapatan" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Tidak ada data pendapatan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
