import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FieldTestimonial from '../components/FieldTestimonial';

function FieldDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [activeTab, setActiveTab] = useState('regular'); // 'regular' or 'event'
  const [eventDates, setEventDates] = useState({
    startDate: '',
    endDate: ''
  });

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  useEffect(() => {
    fetchFieldDetails();
  }, [id]);

  const fetchFieldDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/lapangan/public/${id}`);
      setField(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching field details:', error);
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatShortDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatDayName = (date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long' });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset selected time slot when date changes
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleEventDateChange = (e) => {
    const { name, value } = e.target;
    setEventDates(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = () => {
    if (activeTab === 'regular' && selectedTimeSlot) {
      // For regular booking
      navigate('/booking/form', {
        state: {
          fieldId: id,
          fieldName: field.nama,
          fieldType: field.tipe,
          date: selectedDate.toISOString().split('T')[0],
          timeSlot: selectedTimeSlot,
          bookingType: 'regular'
        }
      });
    } else if (activeTab === 'event' && eventDates.startDate && eventDates.endDate) {
      // For event booking
      navigate('/booking/form', {
        state: {
          fieldId: id,
          fieldName: field.nama,
          fieldType: field.tipe,
          startDate: eventDates.startDate,
          endDate: eventDates.endDate,
          bookingType: 'event'
        }
      });
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

  if (!field) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p className="text-gray-500">Lapangan tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Field Image and Info */}
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={field.foto_url || 'https://via.placeholder.com/600x400?text=No+Image'}
              alt={field.nama}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{field.nama}</h1>
            <p className="text-gray-600 mb-4">
              {field.jenis_lapangan || field.tipe} • Lapangan {field.nomor_lapangan || ''}
            </p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Jam Operasional</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pagi (08:00 - 13:00)</span>
                  <span className="font-semibold">Rp 125.000/jam</span>
                </div>
                <div className="flex justify-between">
                  <span>Siang (13:00 - 17:00)</span>
                  <span className="font-semibold">Rp 150.000/jam</span>
                </div>
                <div className="flex justify-between">
                  <span>Malam (17:00 - 23:00)</span>
                  <span className="font-semibold">Rp 225.000/jam</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Fasilitas</h2>
              <ul className="list-disc list-inside text-gray-600">
                <li>Parkir Luas</li>
                <li>Toilet</li>
                <li>Ruang Ganti</li>
                <li>Kantin</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('regular')}
              className={`py-2 px-4 font-medium ${activeTab === 'regular' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Booking Reguler
            </button>
            <button
              onClick={() => setActiveTab('event')}
              className={`py-2 px-4 font-medium ${activeTab === 'event' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Booking Event
            </button>
          </div>

          {activeTab === 'regular' ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pilih Tanggal</h2>
              <div className="flex overflow-x-auto pb-4 mb-6">
                {dates.map((date, index) => (
                  <div
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`flex-shrink-0 w-24 h-24 mr-4 rounded-lg flex flex-col items-center justify-center cursor-pointer border ${
                      selectedDate.toDateString() === date.toDateString()
                        ? 'bg-blue-50 border-blue-500'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-sm text-gray-500">{formatDayName(date)}</div>
                    <div className="text-2xl font-bold">{date.getDate()}</div>
                    <div className="text-sm text-gray-500">{date.toLocaleDateString('id-ID', { month: 'short' })}</div>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pilih Jam</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {field.waktu_sewa && field.waktu_sewa.map((slot, index) => (
                  <div
                    key={index}
                    onClick={() => handleTimeSlotSelect(slot)}
                    className={`p-4 rounded-lg border cursor-pointer ${
                      selectedTimeSlot === slot
                        ? 'bg-blue-50 border-blue-500'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium">{slot.jam_mulai} - {slot.jam_selesai}</div>
                      <div className="text-lg font-bold text-red-600">Rp {slot.harga.toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Member option for badminton fields */}
              {field.tipe === 'bulutangkis' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Opsi Member Bulutangkis</h3>
                  <p className="text-blue-700 mb-4">
                    Daftar sebagai member bulutangkis untuk mendapatkan harga spesial dan kemudahan booking!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a 
                      href="/member/register" 
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
                    >
                      Daftar Member
                    </a>
                    <a 
                      href="/member/login" 
                      className="bg-white text-blue-500 border border-blue-500 px-4 py-2 rounded hover:bg-blue-50 text-center"
                    >
                      Login Member
                    </a>
                  </div>
                </div>
              )}
              
              {/* Testimonial Section */}
              <div className="border-t border-gray-200 pt-6 mt-6 mb-6">
                <FieldTestimonial lapanganId={field.id} lapanganNama={field.nama} />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Event</h2>
              <p className="text-gray-600 mb-4">
                Untuk booking event, silakan pilih tanggal mulai dan tanggal selesai (maksimal 2 hari).
                Harga akan disesuaikan saat pembayaran di lokasi.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={eventDates.startDate}
                    onChange={handleEventDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={eventDates.endDate}
                    onChange={handleEventDateChange}
                    min={eventDates.startDate || new Date().toISOString().split('T')[0]}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleBookingSubmit}
            disabled={
              (activeTab === 'regular' && !selectedTimeSlot) ||
              (activeTab === 'event' && (!eventDates.startDate || !eventDates.endDate))
            }
            className={`w-full py-3 rounded-lg font-bold ${
              ((activeTab === 'regular' && selectedTimeSlot) ||
                (activeTab === 'event' && eventDates.startDate && eventDates.endDate))
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Lanjut Pemesanan
          </button>
        </div>
      </div>
    </div>
  );
}

export default FieldDetail;
