import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MemberDashboard() {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in
    const memberToken = localStorage.getItem('memberToken');
    if (!memberToken) {
      navigate('/member/login');
      return;
    }
    
    // Fetch member profile and bookings
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        
        // Fetch member profile
        const profileResponse = await axios.get('http://localhost:3000/api/member/profile', {
          headers: { 'Authorization': `Bearer ${memberToken}` }
        });
        
        setMember(profileResponse.data);
        
        // Fetch member bookings
        const bookingsResponse = await axios.get('http://localhost:3000/api/member/bookings', {
          headers: { 'Authorization': `Bearer ${memberToken}` }
        });
        
        setBookings(bookingsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching member data:', error);
        setError('Terjadi kesalahan saat mengambil data member');
        setLoading(false);
        
        // If token is invalid, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('memberToken');
          localStorage.removeItem('memberUser');
          navigate('/member/login');
        }
      }
    };
    
    fetchMemberData();
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberUser');
    navigate('/member/login');
  };
  
  // Format tanggal
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  // Hitung sisa hari membership
  const calculateRemainingDays = () => {
    if (!member) return 0;
    
    const today = new Date();
    const endDate = new Date(member.tanggal_selesai);
    const diffTime = Math.abs(endDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return endDate > today ? diffDays : 0;
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/member/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Kembali ke Login
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Member</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      
      {member && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Member</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Nama:</p>
                <p className="font-medium">{member.nama}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-medium">{member.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Nomor Telepon:</p>
                <p className="font-medium">{member.no_telepon}</p>
              </div>
              <div>
                <p className="text-gray-600">Status:</p>
                <p className={`font-medium ${member.status === 'aktif' ? 'text-green-600' : 'text-red-600'}`}>
                  {member.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Tanggal Mulai:</p>
                <p className="font-medium">{formatDate(member.tanggal_mulai)}</p>
              </div>
              <div>
                <p className="text-gray-600">Tanggal Berakhir:</p>
                <p className="font-medium">{formatDate(member.tanggal_selesai)}</p>
              </div>
              <div>
                <p className="text-gray-600">Sisa Membership:</p>
                <p className="font-medium">
                  {calculateRemainingDays()} hari
                </p>
              </div>
              <div>
                <p className="text-gray-600">Lapangan:</p>
                <p className="font-medium">{member.lapangan_nama || 'Tidak ada'}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                to="/member/profile"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Riwayat Booking</h2>
            <Link
              to="/fields"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Booking Baru
            </Link>
          </div>
          
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Tanggal</th>
                    <th className="py-3 px-6 text-left">Jam</th>
                    <th className="py-3 px-6 text-left">Lapangan</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Total</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {formatDate(booking.tanggal)}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {booking.jam_mulai} - {booking.jam_selesai}
                      </td>
                      <td className="py-3 px-6 text-left">
                        {booking.lapangan_nama}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <span className={`py-1 px-3 rounded-full text-xs ${
                          booking.status_booking === 'confirmed' ? 'bg-green-200 text-green-800' :
                          booking.status_booking === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {booking.status_booking === 'confirmed' ? 'Dikonfirmasi' :
                           booking.status_booking === 'pending' ? 'Menunggu' :
                           'Dibatalkan'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">
                        Rp {booking.total_harga.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Belum ada riwayat booking</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberDashboard;
