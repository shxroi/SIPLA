import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  
  // Redirect if no booking data
  if (!bookingData) {
    navigate('/fields');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div className="ml-2 text-red-500 font-medium">Validasi Item</div>
          </div>
          <div className="w-16 h-1 bg-red-500 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div className="ml-2 text-red-500 font-medium">Data dan Pembayaran</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 bg-green-50 border-b border-gray-200 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pemesanan Berhasil!</h1>
            <p className="text-gray-600">
              Pemesanan Anda telah berhasil dibuat. Silakan lakukan pembayaran di lokasi.
            </p>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Pemesanan</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{bookingData.fieldName}</h3>
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
              
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="font-bold">Total Bayar:</span>
                {bookingData.bookingType === 'regular' ? (
                  <span className="font-bold text-red-600">Rp {bookingData.totalPrice.toLocaleString('id-ID')}</span>
                ) : (
                  <span className="font-bold text-red-600">Ditentukan di lokasi</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Pelanggan</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama:</span>
                <span className="font-medium">{bookingData.customerData.nama_pemesan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No. Telepon:</span>
                <span className="font-medium">+62{bookingData.customerData.no_telepon}</span>
              </div>
              {bookingData.customerData.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{bookingData.customerData.email}</span>
                </div>
              )}
              {bookingData.customerData.catatan && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Catatan:</span>
                  <span className="font-medium">{bookingData.customerData.catatan}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Pembayaran</h2>
            
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-gray-700 font-medium">Silakan lakukan pembayaran di lokasi TQ1 Sports Field.</p>
                  <p className="text-gray-600 mt-1">Pemesanan Anda akan dikonfirmasi oleh admin dan Anda akan menerima notifikasi melalui WhatsApp.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 py-3 rounded-lg font-bold text-center bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Kembali ke Beranda
              </Link>
              <Link
                to="/fields"
                className="flex-1 py-3 rounded-lg font-bold text-center bg-red-500 text-white hover:bg-red-600"
              >
                Lihat Lapangan Lain
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
