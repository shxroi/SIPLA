import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiCheck, FiX, FiFilter, FiCalendar } from 'react-icons/fi';
import EditBookingForm from './EditBookingForm';
import BookingStatusUpdate from './BookingStatusUpdate';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);

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

  // Fungsi untuk menampilkan modal edit booking
  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  // Fungsi untuk menampilkan modal update status booking
  const handleStatusUpdate = (booking) => {
    setSelectedBooking(booking);
    setShowStatusUpdateModal(true);
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
  
  // Fungsi untuk menangani submit dari modal BookingStatusUpdate
  const handleStatusUpdateSubmit = async (formData) => {
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      // Gunakan endpoint admin untuk update status booking
      await axios.put(`http://localhost:3000/api/booking/admin/${selectedBooking.id}/status`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update data booking yang ditampilkan di modal
      if (selectedBooking) {
        setSelectedBooking({
          ...selectedBooking,
          status_booking: formData.status_booking,
          status_pembayaran: formData.status_pembayaran
        });
      }
      
      // Refresh data setelah update
      fetchBookings();
      
      // Tutup modal
      setShowStatusUpdateModal(false);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Terjadi kesalahan saat mengupdate status booking.');
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

  // Handle submit dari form edit booking
  const handleEditSubmit = async (formData) => {
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      console.log('Updating booking with data:', formData);
      
      // Gunakan endpoint admin untuk update booking
      await axios.put(`http://localhost:3000/api/booking/admin/${selectedBooking.id}`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update selectedBooking jika masih ditampilkan di modal
      if (selectedBooking) {
        setSelectedBooking({
          ...selectedBooking,
          ...formData
        });
      }
      
      // Refresh data setelah update
      fetchBookings();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Terjadi kesalahan saat mengupdate booking: ' + (error.response?.data?.message || error.message));
    }
  };

  // Kode yang dihapus untuk menghindari deklarasi ganda

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
                    <td className="px-4 py-2 border-b border-gray-200">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Lihat Detail"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditBooking(booking)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit Booking"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(booking)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Update Status"
                      >
                        <FiCheck size={18} />
                      </button>
                      <button 
                        onClick={() => deleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus Booking"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Detail Modal */}
      {selectedBooking && showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Detail Booking #{selectedBooking.id}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pemesan</h3>
                <p className="text-base text-gray-900">{selectedBooking.nama_pemesan}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">No. Telepon</h3>
                <p className="text-base text-gray-900">{selectedBooking.no_telepon}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Lapangan</h3>
                <p className="text-base text-gray-900">{selectedBooking.lapangan_nama}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tanggal</h3>
                <p className="text-base text-gray-900">{formatDate(selectedBooking.tanggal)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Waktu</h3>
                <p className="text-base text-gray-900">{formatTime(selectedBooking.jam_mulai)} - {formatTime(selectedBooking.jam_selesai)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Harga</h3>
                <p className="text-base text-gray-900">{formatPrice(selectedBooking.total_harga)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status Booking</h3>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedBooking.status_booking)}`}>
                  {selectedBooking.status_booking}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status Pembayaran</h3>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedBooking.status_pembayaran)}`}>
                  {selectedBooking.status_pembayaran}
                </span>
              </div>
              
              {selectedBooking.catatan && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Catatan</h3>
                  <p className="text-base text-gray-900">{selectedBooking.catatan}</p>
                </div>
              )}
              
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Tutup
                </button>
                <button
                  onClick={() => sendWhatsAppNotification(selectedBooking)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Kirim Notifikasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {selectedBooking && showStatusUpdateModal && (
        <BookingStatusUpdate 
          booking={selectedBooking} 
          onClose={() => setShowStatusUpdateModal(false)} 
          onSubmit={handleStatusUpdateSubmit} 
        />
      )}
    </div>
  );
};

export default RegularBookings;
