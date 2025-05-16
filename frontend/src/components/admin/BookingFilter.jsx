import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingFilter = ({ filters, onFilterChange }) => {
  const [lapangan, setLapangan] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    tanggal_mulai: filters.tanggal_mulai || '',
    tanggal_akhir: filters.tanggal_akhir || '',
    status_booking: filters.status_booking || '',
    status_pembayaran: filters.status_pembayaran || '',
    tipe_booking: filters.tipe_booking || '',
    search: filters.search || '',
    lapangan_id: filters.lapangan_id || ''
  });

  useEffect(() => {
    const fetchLapangan = async () => {
      try {
        // Menggunakan endpoint public yang tidak memerlukan autentikasi
        const response = await axios.get('http://localhost:3000/api/lapangan/public');
        
        setLapangan(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching lapangan:', error);
      }
    };

    fetchLapangan();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      tanggal_mulai: '',
      tanggal_akhir: '',
      status_booking: '',
      status_pembayaran: '',
      tipe_booking: '',
      search: '',
      lapangan_id: ''
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Booking</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <input
              type="date"
              name="tanggal_mulai"
              value={localFilters.tanggal_mulai}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir
            </label>
            <input
              type="date"
              name="tanggal_akhir"
              value={localFilters.tanggal_akhir}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Booking
            </label>
            <select
              name="status_booking"
              value={localFilters.status_booking}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Semua</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Pembayaran
            </label>
            <select
              name="status_pembayaran"
              value={localFilters.status_pembayaran}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Semua</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Booking
            </label>
            <select
              name="tipe_booking"
              value={localFilters.tipe_booking}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Semua</option>
              <option value="sekali">Sekali</option>
              <option value="event">Event</option>
              <option value="member">Member</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lapangan
            </label>
            <select
              name="lapangan_id"
              value={localFilters.lapangan_id}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Semua</option>
              {lapangan.map(lap => (
                <option key={lap.id} value={lap.id}>
                  {lap.nama} ({lap.tipe})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cari (Nama/No. Telepon)
            </label>
            <input
              type="text"
              name="search"
              value={localFilters.search}
              onChange={handleInputChange}
              placeholder="Cari..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Filter
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingFilter;
