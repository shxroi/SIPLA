import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingForm = ({ onClose, onSuccess }) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [formData, setFormData] = useState({
    lapangan_id: '',
    nama_pemesan: '',
    no_telepon: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    tipe_booking: 'regular',
    total_harga: 0,
    catatan: '',
    status_booking: 'pending',
    tipe_lapangan: 'bulutangkis', // Default tipe lapangan
    status_pembayaran: 'pending'
  });

  // Fetch available fields
  // State untuk menyimpan semua lapangan
  const [allFields, setAllFields] = useState([]);

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
  }, []);

  // Fetch time slots when field is selected
  useEffect(() => {
    if (formData.lapangan_id) {
      const fetchTimeSlots = async () => {
        try {
          const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
          const response = await axios.get(`http://localhost:3000/api/lapangan/${formData.lapangan_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.data.waktu_sewa) {
            setTimeSlots(response.data.waktu_sewa);
          }
        } catch (error) {
          console.error('Error fetching time slots:', error);
          setError('Gagal memuat data waktu sewa');
        }
      };

      fetchTimeSlots();
    }
  }, [formData.lapangan_id]);

  // Calculate total price when time slots change
  useEffect(() => {
    if (formData.jam_mulai && formData.jam_selesai && timeSlots.length > 0) {
      const startTime = formData.jam_mulai;
      const endTime = formData.jam_selesai;
      
      // Find matching time slot
      const matchingSlot = timeSlots.find(slot => 
        slot.jam_mulai === startTime && slot.jam_selesai === endTime
      );
      
      if (matchingSlot) {
        setTotalPrice(matchingSlot.harga);
        setFormData(prev => ({ ...prev, total_harga: matchingSlot.harga }));
      }
    }
  }, [formData.jam_mulai, formData.jam_selesai, timeSlots]);

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

    // Reset time slots when field changes
    if (name === 'lapangan_id') {
      setTimeSlots([]);
      fetchTimeSlots(value, formData.tanggal);
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
        lapangan_id: parseInt(formData.lapangan_id),
        status_booking: 'pending',
        status_pembayaran: 'pending'
      };
      
      console.log('Sending booking data:', bookingData);
      
      await axios.post('http://localhost:3000/api/booking', bookingData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat membuat booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Tambah Booking Regular</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
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

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Jam Mulai
              </label>
              <select
                name="jam_mulai"
                value={formData.jam_mulai}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Pilih Jam</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot.jam_mulai}>
                    {slot.jam_mulai}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Jam Selesai
              </label>
              <select
                name="jam_selesai"
                value={formData.jam_selesai}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Pilih Jam</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot.jam_selesai}>
                    {slot.jam_selesai}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Total Harga
            </label>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100">
              Rp {totalPrice.toLocaleString('id-ID')}
            </div>
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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
