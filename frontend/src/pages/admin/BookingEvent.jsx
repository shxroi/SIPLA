import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BookingFilter from '../../components/admin/BookingFilter';
import BookingList from '../../components/admin/BookingList';
import BookingDetail from '../../components/admin/BookingDetail';
import BookingStatusUpdate from '../../components/admin/BookingStatusUpdate';
import Pagination from '../../components/admin/Pagination';

const BookingEvent = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    tanggal_mulai: '',
    tanggal_akhir: '',
    status_booking: '',
    status_pembayaran: '',
    search: '',
    lapangan_id: ''
  });
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10
  });

  const getAuthData = () => {
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    return {
      id: adminUser.id,
      token: adminUser.token
    };
  };

  const fetchBookings = async () => {
    const { token } = getAuthData();
    if (!token) {
      navigate('/admin');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build query params
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(`http://localhost:3000/api/booking/admin/event?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setBookings(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.response?.status === 401) {
        navigate('/admin');
      } else {
        setError('Gagal memuat data booking event');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters.page, filters.limit]);

  const handleFilterChange = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    });
    
    // Only fetch if it's not a page/limit change (those are handled by useEffect)
    if (!('page' in newFilters) && !('limit' in newFilters)) {
      fetchBookings();
    }
  };

  const handlePageChange = (page) => {
    setFilters({
      ...filters,
      page
    });
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleStatusUpdate = (booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
  };

  const handleStatusUpdateSuccess = () => {
    setShowStatusModal(false);
    fetchBookings();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
      return;
    }

    const { token } = getAuthData();
    try {
      await axios.delete(`http://localhost:3000/api/booking/admin/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Gagal menghapus booking');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Booking Event</h1>
      </div>
      
      <BookingFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {bookings.length > 0 ? (
            <BookingList 
              bookings={bookings}
              onViewDetail={handleViewDetail}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              Tidak ada data booking event.
            </div>
          )}
          
          <div className="mt-6">
            <Pagination 
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
      
      {showDetailModal && selectedBooking && (
        <BookingDetail 
          booking={selectedBooking}
          onClose={() => setShowDetailModal(false)}
        />
      )}
      
      {showStatusModal && selectedBooking && (
        <BookingStatusUpdate 
          booking={selectedBooking}
          onClose={() => setShowStatusModal(false)}
          onSuccess={handleStatusUpdateSuccess}
        />
      )}
    </div>
  );
};

export default BookingEvent;
