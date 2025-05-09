import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiCheck, FiX, FiFilter, FiCalendar } from 'react-icons/fi';

const RegularBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [lapangan, setLapangan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    tanggal: '',
    lapangan_id: '',
    status_booking: ''
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fungsi untuk mengambil data booking reguler
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      // Buat parameter query dari filter
      const params = {};
      if (filters.tanggal) params.tanggal = filters.tanggal;
      if (filters.lapangan_id) params.lapangan_id = filters.lapangan_id;
      if (filters.status_booking) params.status_booking = filters.status_booking;
      
      // Tambahkan parameter tipe_booking=reguler untuk hanya mendapatkan booking reguler
      params.tipe_booking = 'reguler';
      
      const response = await axios.get('http://localhost:3000/api/booking', {
        params,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil data lapangan
  const fetchLapangan = async () => {
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      const response = await axios.get('http://localhost:3000/api/lapangan', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setLapangan(response.data);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchLapangan();
  }, []);

  // Fungsi untuk menerapkan filter
  const applyFilters = () => {
    fetchBookings();
    setShowFilter(false);
  };

  // Fungsi untuk reset filter
  const resetFilters = () => {
    setFilters({
      tanggal: '',
      lapangan_id: '',
      status_booking: ''
    });
    fetchBookings();
    setShowFilter(false);
  };

  // Fungsi untuk mengubah status booking
  const updateBookingStatus = async (id, newStatus) => {
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      await axios.put(`http://localhost:3000/api/booking/${id}/status`, {
        status_booking: newStatus
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Refresh data
      fetchBookings();
      
      // Jika booking yang diupdate adalah yang sedang ditampilkan di modal, update juga data di modal
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({
          ...selectedBooking,
          status_booking: newStatus
        });
      }
      
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Terjadi kesalahan saat mengubah status booking.');
    }
  };

  // Fungsi untuk menghapus booking
  const deleteBooking = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
      return;
    }
    
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      await axios.delete(`http://localhost:3000/api/booking/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
        });
      
      // Refresh data
      fetchBookings();
      
      // Jika booking yang dihapus adalah yang sedang ditampilkan di modal, tutup modal
      if (selectedBooking && selectedBooking.id === id) {
        setShowDetailModal(false);
      }
      
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Terjadi kesalahan saat menghapus booking.');
    }
  };

  // Fungsi untuk mengirim notifikasi WhatsApp
  const sendWhatsAppNotification = async (booking) => {
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      await axios.post(`http://localhost:3000/api/booking/${booking.id}/notify`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      alert(`Notifikasi berhasil dikirim ke ${booking.nama_pemesan} (${booking.no_telepon})`);
      
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Terjadi kesalahan saat mengirim notifikasi.');
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format waktu
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Format HH:MM
  };

  // Format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Get lapangan name by id
  const getLapanganName = (id) => {
    const field = lapangan.find(l => l.id === id);
    return field ? `${field.nama} (${field.tipe})` : 'Tidak diketahui';
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Manajemen Booking Reguler</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-md flex items-center ${showFilter ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <FiFilter className="mr-2" /> Filter
          </button>
        </div>
      </div>
      
      {/* Filter Panel */}
      {showFilter && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.tanggal}
                onChange={(e) => setFilters({...filters, tanggal: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lapangan</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.lapangan_id}
                onChange={(e) => setFilters({...filters, lapangan_id: e.target.value})}
              >
                <option value="">Semua Lapangan</option>
                {lapangan.map(field => (
                  <option key={field.id} value={field.id}>
                    {field.nama} ({field.tipe})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.status_booking}
                onChange={(e) => setFilters({...filters, status_booking: e.target.value})}
              >
                <option value="">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button 
              className="mr-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={resetFilters}
            >
              Reset
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={applyFilters}
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
      
      {/* Daftar Booking */}
      {loading ? (
        <div className="text-center py-10">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemesan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lapangan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada data booking reguler.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.nama_pemesan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLapanganName(booking.lapangan_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(booking.tanggal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(booking.jam_mulai)} - {formatTime(booking.jam_selesai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(booking.total_harga)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status_booking)}`}>
                        {booking.status_booking}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetailModal(true);
                        }}
                        title="Detail"
                      >
                        <FiCalendar />
                      </button>
                      {booking.status_booking === 'pending' && (
                        <button 
                          className="text-green-600 hover:text-green-900 mr-2"
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          title="Konfirmasi"
                        >
                          <FiCheck />
                        </button>
                      )}
                      {booking.status_booking !== 'cancelled' && booking.status_booking !== 'completed' && (
                        <button 
                          className="text-red-600 hover:text-red-900 mr-2"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          title="Batalkan"
                        >
                          <FiX />
                        </button>
                      )}
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => deleteBooking(booking.id)}
                        title="Hapus"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Detail Booking #{selectedBooking.id}</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowDetailModal(false)}
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Informasi Pemesan</h4>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Nama:</span> {selectedBooking.nama_pemesan}</p>
                  <p><span className="font-medium">No. Telepon:</span> {selectedBooking.no_telepon}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Informasi Booking</h4>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Lapangan:</span> {getLapanganName(selectedBooking.lapangan_id)}</p>
                  <p><span className="font-medium">Tanggal:</span> {formatDate(selectedBooking.tanggal)}</p>
                  <p><span className="font-medium">Waktu:</span> {formatTime(selectedBooking.jam_mulai)} - {formatTime(selectedBooking.jam_selesai)}</p>
                  <p><span className="font-medium">Total Harga:</span> {formatPrice(selectedBooking.total_harga)}</p>
                  <p><span className="font-medium">Status Booking:</span> 
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedBooking.status_booking)}`}>
                      {selectedBooking.status_booking}
                    </span>
                  </p>
                  <p><span className="font-medium">Status Pembayaran:</span> 
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedBooking.status_pembayaran === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedBooking.status_pembayaran}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            {selectedBooking.catatan && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Catatan</h4>
                <p className="mt-2 text-sm text-gray-600">{selectedBooking.catatan}</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-between">
              <div>
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                  onClick={() => sendWhatsAppNotification(selectedBooking)}
                >
                  Kirim Notifikasi WhatsApp
                </button>
                {selectedBooking.status_pembayaran !== 'paid' && (
                  <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => {
                      // Update status pembayaran
                      // Implementasi akan ditambahkan nanti
                      alert('Fitur update status pembayaran akan segera tersedia.');
                    }}
                  >
                    Update Pembayaran
                  </button>
                )}
              </div>
              
              <div>
                {selectedBooking.status_booking === 'pending' && (
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'confirmed');
                      setShowDetailModal(false);
                    }}
                  >
                    Konfirmasi Booking
                  </button>
                )}
                {selectedBooking.status_booking !== 'cancelled' && selectedBooking.status_booking !== 'completed' && (
                  <button 
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'cancelled');
                      setShowDetailModal(false);
                    }}
                  >
                    Batalkan Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegularBookings;
