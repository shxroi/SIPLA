import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/tq1-landing.css';

function MemberDashboard() {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const memberToken = localStorage.getItem('memberToken');
    if (!memberToken) {
      navigate('/member/login');
      return;
    }

    const fetchMemberData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch member profile
        const profileResponse = await axios.get('http://localhost:3000/api/member/profile', {
          headers: { Authorization: `Bearer ${memberToken}` },
        });
        setMember(profileResponse.data);

        // Fetch member bookings
        const bookingsResponse = await axios.get('http://localhost:3000/api/member/bookings', {
          headers: { Authorization: `Bearer ${memberToken}` },
        });
        setBookings(bookingsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching member data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('memberToken');
          localStorage.removeItem('memberUser');
          navigate('/member/login', { state: { message: 'Sesi telah berakhir. Silakan login kembali.' } });
        } else {
          setError(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data.');
        }
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberUser');
    navigate('/member/login', { state: { message: 'Anda telah logout.' } });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString || typeof timeString !== 'string') {
      return '--:--';
    }
    return timeString.slice(0, 5); // Remove seconds from HH:MM:SS
  };

  const calculateRemainingDays = () => {
    if (!member) return 0;
    const today = new Date();
    const endDate = new Date(member.tanggal_berakhir);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/member/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Member</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>

      {member && (
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Informasi Member</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm font-medium">Nama</p>
                <p className="text-gray-900 font-medium">{member.nama}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Email</p>
                <p className="text-gray-900 font-medium">{member.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Status</p>
                <p
                  className={`font-medium ${
                    member.status === 'aktif' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {member.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Sisa Hari Membership</p>
                <p className="text-gray-900 font-medium">{calculateRemainingDays()} hari</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Lapangan</p>
                <p className="text-gray-900 font-medium">{member.lapangan_nama || 'Tidak ada'}</p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/member/profile"
                className="text-blue-600 hover:underline font-medium"
              >
                Edit Profil
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Riwayat Booking</h2>
            <Link
              to="/member/booking"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Buat Booking Baru
            </Link>
          </div>
          {bookings.length === 0 ? (
            <p className="text-gray-600 text-center py-6">Belum ada booking.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lapangan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(booking.tanggal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.lapangan_nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(booking.jam_mulai)} - {formatTime(booking.jam_berakhir)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status_booking === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status_booking === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status_booking.charAt(0).toUpperCase() + booking.status_booking.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;