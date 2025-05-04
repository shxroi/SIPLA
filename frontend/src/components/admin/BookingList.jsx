import React from 'react';

const BookingList = ({ bookings, onViewDetail, onStatusUpdate, onDelete }) => {
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
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {bookings.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Tidak ada data booking
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pemesan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lapangan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal & Waktu
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pembayaran
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.nama_pemesan}</div>
                    <div className="text-sm text-gray-500">{booking.no_telepon}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.lapangan_nama}</div>
                    <div className="text-sm text-gray-500 capitalize">{booking.lapangan_tipe}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(booking.tanggal)}</div>
                    {booking.tipe_booking === 'event' && booking.event_details ? (
                      <div className="text-sm text-gray-500">
                        {formatDate(booking.event_details.tanggal_mulai)} - {formatDate(booking.event_details.tanggal_selesai)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {formatTime(booking.jam_mulai)} - {formatTime(booking.jam_selesai)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={booking.status_booking} type="booking" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={booking.status_pembayaran} type="payment" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {booking.tipe_booking}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewDetail(booking)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => onStatusUpdate(booking)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => onDelete(booking.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingList;
