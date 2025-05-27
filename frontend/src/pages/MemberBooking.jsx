import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function MemberBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state; // Data booking dari halaman sebelumnya (jika ada)
  
  const [member, setMember] = useState(null);
  const [formData, setFormData] = useState({
    tanggal: bookingData?.date || new Date().toISOString().split('T')[0],
    jam_mulai: bookingData?.timeSlot?.jam_mulai || '',
    jam_selesai: bookingData?.timeSlot?.jam_selesai || '',
    catatan: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in
    const memberToken = localStorage.getItem('memberToken');
    if (!memberToken) {
      // Redirect to login with booking data
      navigate('/member/login', { state: bookingData });
      return;
    }
    
    // Fetch member profile and available slots
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch member profile
        const profileResponse = await axios.get('http://localhost:3000/api/member/profile', {
          headers: { 'Authorization': `Bearer ${memberToken}` }
        });
        
        setMember(profileResponse.data);
        
        // Fetch available slots if we have booking data
        if (bookingData?.fieldId) {
          await fetchAvailableSlots(bookingData.fieldId, formData.tanggal);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Terjadi kesalahan saat mengambil data');
        setLoading(false);
        
        // If token is invalid, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('memberToken');
          localStorage.removeItem('memberUser');
          navigate('/member/login', { state: bookingData });
        }
      }
    };
    
    fetchData();
  }, [navigate, bookingData]);
  
  const fetchAvailableSlots = async (fieldId, date) => {
    try {
      const memberToken = localStorage.getItem('memberToken');
      
      const response = await axios.get(
        `http://localhost:3000/api/member/check-availability/${fieldId}/${date}`,
        { headers: { 'Authorization': `Bearer ${memberToken}` } }
      );
      
      setAvailableSlots(response.data.availableSlots || []);
      
      // If we have a selected time slot from previous page, select it
      if (bookingData?.timeSlot) {
        const matchingSlot = response.data.availableSlots.find(
          slot => slot.jam_mulai === bookingData.timeSlot.jam_mulai && 
                 slot.jam_selesai === bookingData.timeSlot.jam_selesai
        );
        
        if (matchingSlot) {
          setSelectedSlot(matchingSlot);
        }
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setError('Terjadi kesalahan saat mengambil jadwal tersedia');
    }
  };
  
  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setFormData(prev => ({ ...prev, tanggal: newDate }));
    
    if (bookingData?.fieldId) {
      await fetchAvailableSlots(bookingData.fieldId, newDate);
    }
  };
  
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setFormData(prev => ({
      ...prev,
      jam_mulai: slot.jam_mulai,
      jam_selesai: slot.jam_selesai
    }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      setError('Silakan pilih jadwal terlebih dahulu');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const memberToken = localStorage.getItem('memberToken');
      
      // Create booking
      const response = await axios.post(
        'http://localhost:3000/api/booking',
        {
          lapangan_id: bookingData.fieldId,
          tanggal: formData.tanggal,
          jam_mulai: formData.jam_mulai,
          jam_selesai: formData.jam_selesai,
          nama_pemesan: member.nama,
          no_telepon: member.no_telepon,
          email: member.email,
          catatan: formData.catatan,
          member_id: member.id,
          total_harga: selectedSlot.harga,
          tipe_booking: 'reguler'
        },
        { headers: { 'Authorization': `Bearer ${memberToken}` } }
      );
      
      // Navigate to confirmation page
      navigate('/booking/confirmation', {
        state: {
          fieldId: bookingData.fieldId,
          fieldName: bookingData.fieldName,
          fieldType: bookingData.fieldType,
          date: formData.tanggal,
          timeSlot: selectedSlot,
          bookingType: 'regular',
          customerData: {
            nama_pemesan: member.nama,
            no_telepon: member.no_telepon,
            email: member.email,
            catatan: formData.catatan
          },
          totalPrice: selectedSlot.harga,
          bookingId: response.data.id,
          isMember: true
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat membuat booking');
    } finally {
      setSubmitting(false);
    }
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
  
  if (!bookingData || !bookingData.fieldId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          Data booking tidak lengkap. Silakan pilih lapangan terlebih dahulu.
        </div>
        <button
          onClick={() => navigate('/fields')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Pilih Lapangan
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div className="ml-2 text-blue-500 font-medium">Pilih Jadwal</div>
          </div>
          <div className="w-16 h-1 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div className="ml-2 text-gray-500 font-medium">Konfirmasi</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Lapangan Member</h1>
            <p className="text-gray-600 mb-4">
              Silakan pilih tanggal dan jadwal untuk booking lapangan.
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{bookingData.fieldName}</h2>
              <p className="text-gray-600">{bookingData.fieldType}</p>
            </div>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tanggal">
                  Pilih Tanggal
                </label>
                <input
                  id="tanggal"
                  name="tanggal"
                  type="date"
                  value={formData.tanggal}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pilih Jadwal
                </label>
                
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {availableSlots.map((slot, index) => (
                      <div
                        key={index}
                        onClick={() => handleSlotSelect(slot)}
                        className={`p-4 rounded-lg border cursor-pointer ${
                          selectedSlot === slot
                            ? 'bg-blue-50 border-blue-500'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-medium">{slot.jam_mulai} - {slot.jam_selesai}</div>
                          <div className="text-lg font-bold text-blue-600">
                            Rp {slot.harga.toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Tidak ada jadwal tersedia pada tanggal ini</p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="catatan">
                  Catatan (Opsional)
                </label>
                <textarea
                  id="catatan"
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="Tambahkan catatan jika diperlukan"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={submitting || !selectedSlot}
                className={`w-full py-3 rounded-lg font-bold ${
                  submitting || !selectedSlot
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {submitting ? 'Memproses...' : 'Lanjut ke Konfirmasi'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberBooking;
