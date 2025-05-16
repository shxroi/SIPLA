import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditBookingForm = ({ booking, onClose, onSuccess }) => {
  const [fields, setFields] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const [formData, setFormData] = useState({
    lapangan_id: booking.lapangan_id || '',
    nama_pemesan: booking.nama_pemesan || '',
    no_telepon: booking.no_telepon || '',
    tanggal: booking.tanggal ? booking.tanggal.split('T')[0] : '',
    jam_mulai: booking.jam_mulai || '',
    jam_selesai: booking.jam_selesai || '',
    tipe_booking: booking.tipe_booking || 'regular',
    total_harga: booking.total_harga || 0,
    catatan: booking.catatan || '',
    status_booking: booking.status_booking || 'pending',
    status_pembayaran: booking.status_pembayaran || 'pending',
    tipe_lapangan: booking.lapangan_tipe || 'bulutangkis'
  });

  // Fetch available fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
        // Mengambil semua jenis lapangan
        const response = await axios.get('http://localhost:3000/api/lapangan/public', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setAllFields(response.data);
        // Filter lapangan berdasarkan tipe yang dipilih
        const filteredFields = response.data.filter(field => field.tipe === formData.tipe_lapangan);
        setFields(filteredFields);
      } catch (error) {
        console.error('Error fetching fields:', error);
        setError('Gagal memuat data lapangan');
      }
    };

    fetchFields();
  }, [formData.tipe_lapangan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Jika tipe lapangan berubah, filter lapangan berdasarkan tipe
    if (name === 'tipe_lapangan') {
      const filteredFields = allFields.filter(field => field.tipe === value);
      setFields(filteredFields);
      // Reset lapangan_id jika tipe berubah
      setFormData(prev => ({
        ...prev,
        lapangan_id: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      // Pastikan format data sesuai dengan yang diharapkan API
      const bookingData = {
        ...formData,
        total_harga: parseInt(formData.total_harga),
        lapangan_id: parseInt(formData.lapangan_id)
      };
      
      console.log('Sending updated booking data:', bookingData);
      
      // Gunakan endpoint admin untuk update booking
      await axios.put(`http://localhost:3000/api/booking/admin/${booking.id}`, bookingData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating booking:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat mengupdate booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tipe Lapangan
            </label>
            <select
              name="tipe_lapangan"
              value={formData.tipe_lapangan}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="bulutangkis">Badminton</option>
              <option value="futsal">Futsal</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Lapangan
            </label>
            <select
              name="lapangan_id"
              value={formData.lapangan_id}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Pilih Lapangan</option>
              {fields.map(field => (
                <option key={field.id} value={field.id}>
                  {field.nama} - {field.nomor_lapangan}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nama Pemesan
            </label>
            <input
              type="text"
              name="nama_pemesan"
              value={formData.nama_pemesan}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              No. Telepon
            </label>
            <input
              type="text"
              name="no_telepon"
              value={formData.no_telepon}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tanggal
            </label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Jam Mulai
              </label>
              <input
                type="time"
                name="jam_mulai"
                value={formData.jam_mulai}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Jam Selesai
              </label>
              <input
                type="time"
                name="jam_selesai"
                value={formData.jam_selesai}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Total Harga
            </label>
            <input
              type="number"
              name="total_harga"
              value={formData.total_harga}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status Booking
            </label>
            <select
              name="status_booking"
              value={formData.status_booking}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status Pembayaran
            </label>
            <select
              name="status_pembayaran"
              value={formData.status_pembayaran}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Catatan
            </label>
            <textarea
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingForm;
