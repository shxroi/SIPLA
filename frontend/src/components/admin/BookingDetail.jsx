import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingDetail = ({ booking, onClose, onStatusUpdate }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setLoading(true);
        const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
        const token = adminUser.token;

        const response = await axios.get(`http://localhost:3000/api/booking/admin/${booking.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setDetailData(response.data);
      } catch (error) {
        console.error('Error fetching booking detail:', error);
        setError('Gagal memuat detail booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [booking.id]);

  // Format tanggal: 2023-05-01 -> 01 Mei 2023
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Format waktu: 14:00:00 -> 14:00
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  };

  // Format timestamp: 2023-05-01T14:00:00 -> 01 Mei 2023, 14:00
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    
    return `${date.toLocaleDateString('id-ID', dateOptions)}, ${date.toLocaleTimeString('id-ID', timeOptions)}`;
  };

  // Format harga: 150000 -> Rp 150.000
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '-';
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  // Render status badge dengan warna yang sesuai
  const StatusBadge = ({ status, type = 'booking' }) => {
    let bgColor, textColor;
    
    if (type === 'booking') {
      switch (status) {
        case 'pending':
          bgColor = 'bg-yellow-100';
          textColor = 'text-yellow-800';
          break;
        case 'confirmed':
          bgColor = 'bg-green-100';
          textColor = 'text-green-800';
          break;
        case 'completed':
          bgColor = 'bg-blue-100';
          textColor = 'text-blue-800';
          break;
        case 'cancelled':
          bgColor = 'bg-red-100';
          textColor = 'text-red-800';
          break;
        default:
          bgColor = 'bg-gray-100';
          textColor = 'text-gray-800';
      }
    } else if (type === 'payment') {
      switch (status) {
        case 'paid':
          bgColor = 'bg-green-100';
          textColor = 'text-green-800';
          break;
        case 'pending':
          bgColor = 'bg-yellow-100';
          textColor = 'text-yellow-800';
          break;
        case 'cancelled':
          bgColor = 'bg-red-100';
          textColor = 'text-red-800';
          break;
        default:
          bgColor = 'bg-gray-100';
          textColor = 'text-gray-800';
      }
    }
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Detail Booking #{booking.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
              {error}
            </div>
          ) : detailData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Booking</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status Booking</p>
                      <div className="mt-1">
                        <StatusBadge status={detailData.status_booking} type="booking" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status Pembayaran</p>
                      <div className="mt-1">
                        <StatusBadge status={detailData.status_pembayaran} type="payment" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipe Booking</p>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{detailData.tipe_booking}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tanggal Booking</p>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(detailData.tanggal)}</p>
                    </div>
                    
                    {detailData.tipe_booking === 'event' && detailData.event_details ? (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nama Event</p>
                          <p className="mt-1 text-sm text-gray-900">{detailData.event_details.nama_event}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tanggal Event</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {formatDate(detailData.event_details.tanggal_mulai)} - {formatDate(detailData.event_details.tanggal_selesai)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Deskripsi Event</p>
                          <p className="mt-1 text-sm text-gray-900">{detailData.event_details.deskripsi || '-'}</p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Waktu</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatTime(detailData.jam_mulai)} - {formatTime(detailData.jam_selesai)}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Harga</p>
                      <p className="mt-1 text-sm text-gray-900 font-semibold">{formatPrice(detailData.total_harga)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Catatan</p>
                      <p className="mt-1 text-sm text-gray-900">{detailData.catatan || '-'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Pemesan</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nama Pemesan</p>
                      <p className="mt-1 text-sm text-gray-900">{detailData.nama_pemesan}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nomor Telepon</p>
                      <p className="mt-1 text-sm text-gray-900">{detailData.no_telepon}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lapangan</p>
                      <p className="mt-1 text-sm text-gray-900">{detailData.lapangan_nama}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipe Lapangan</p>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{detailData.lapangan_tipe}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tanggal Dibuat</p>
                      <p className="mt-1 text-sm text-gray-900">{formatTimestamp(detailData.created_at)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Terakhir Diupdate</p>
                      <p className="mt-1 text-sm text-gray-900">{formatTimestamp(detailData.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {detailData.history && detailData.history.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Riwayat Status</h3>
                  
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Waktu</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status Lama</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status Baru</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Catatan</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Admin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {detailData.history.map((item, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">{formatTimestamp(item.created_at)}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.status_lama}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.status_baru}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.catatan || '-'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.admin_username || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Tutup
                </button>
                <button
                  onClick={onStatusUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Update Status
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              Data tidak ditemukan
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
