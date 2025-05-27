import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CustomerBookingForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  
  const [formData, setFormData] = useState({
    nama_pemesan: '',
    no_telepon: '',
    email: '',
    catatan: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Redirect if no booking data
  if (!bookingData) {
    navigate('/fields');
    return null;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const calculateTotalPrice = () => {
    if (bookingData.bookingType === 'regular') {
      return bookingData.timeSlot.harga;
    } else {
      // For event booking, price will be determined at the venue
      return 0;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const requestData = {
        lapangan_id: bookingData.fieldId,
        nama_pemesan: formData.nama_pemesan,
        no_telepon: formData.no_telepon,
        email: formData.email || null,
        catatan: formData.catatan || '',
        total_harga: calculateTotalPrice()
      };
      
      if (bookingData.bookingType === 'regular') {
        // Regular booking
        requestData.tanggal = bookingData.date;
        requestData.jam_mulai = bookingData.timeSlot.jam_mulai;
        requestData.jam_selesai = bookingData.timeSlot.jam_selesai;
        requestData.tipe_booking = 'reguler';
        
        await axios.post('http://localhost:3000/api/booking', requestData);
      } else {
        // Event booking
        requestData.tanggal_mulai = bookingData.startDate;
        requestData.tanggal_selesai = bookingData.endDate;
        requestData.nama_event = formData.nama_pemesan; // Using customer name as event name
        requestData.tipe_booking = 'event';
        
        await axios.post('http://localhost:3000/api/booking/event', requestData);
      }
      
      // Navigate to confirmation page
      navigate('/booking/confirmation', { 
        state: { 
          ...bookingData,
          customerData: formData,
          totalPrice: calculateTotalPrice()
        } 
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat membuat booking');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div className="ml-2 text-red-500 font-medium">Validasi Item</div>
          </div>
          <div className="w-16 h-1 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div className="ml-2 text-gray-500 font-medium">Data dan Pembayaran</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Periksa Pemesanan Anda</h1>
            <p className="text-gray-600 mb-4">Pastikan detail pemesanan sudah benar sebelum lanjut.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{bookingData.fieldName}</h2>
              <p className="text-gray-600">{bookingData.fieldType}</p>
              
              {bookingData.bookingType === 'regular' ? (
                <>
                  <div className="flex justify-between mt-4">
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="font-medium">{new Date(bookingData.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">Jam:</span>
                    <span className="font-medium">{bookingData.timeSlot.jam_mulai} - {bookingData.timeSlot.jam_selesai}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between mt-4">
                    <span className="text-gray-600">Tanggal Mulai:</span>
                    <span className="font-medium">{new Date(bookingData.startDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">Tanggal Selesai:</span>
                    <span className="font-medium">{new Date(bookingData.endDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Harga lapangan:</span>
                {bookingData.bookingType === 'regular' ? (
                  <span className="font-medium">Rp {bookingData.timeSlot.harga.toLocaleString('id-ID')}</span>
                ) : (
                  <span className="font-medium">Ditentukan di lokasi</span>
                )}
              </div>
              
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Platform Fee:</span>
                <span className="font-medium">Rp 0</span>
              </div>
              
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="font-bold">Total Bayar:</span>
                {bookingData.bookingType === 'regular' ? (
                  <span className="font-bold text-red-600">Rp {bookingData.timeSlot.harga.toLocaleString('id-ID')}</span>
                ) : (
                  <span className="font-bold text-red-600">Ditentukan di lokasi</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Detail</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama_pemesan">
                  Nama Pemesan <span className="text-red-500">*</span>
                </label>
                <input
                  id="nama_pemesan"
                  name="nama_pemesan"
                  type="text"
                  value={formData.nama_pemesan}
                  onChange={handleChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Nama lengkap"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="no_telepon">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 rounded-l px-3 py-2 text-gray-700">
                    +62
                  </div>
                  <input
                    id="no_telepon"
                    name="no_telepon"
                    type="tel"
                    value={formData.no_telepon}
                    onChange={handleChange}
                    required
                    className="shadow appearance-none border rounded-r w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="8123456789"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Nomor WhatsApp aktif untuk pengiriman nota elektronik
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="catatan">
                  Catatan
                </label>
                <textarea
                  id="catatan"
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="Tambahkan catatan (opsional)"
                ></textarea>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {loading ? 'Memproses...' : 'Konfirmasi Pemesanan'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerBookingForm;
