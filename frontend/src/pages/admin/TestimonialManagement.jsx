import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StarRating from '../../components/StarRating';

function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionStatus, setActionStatus] = useState({ message: '', type: '' });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, statusFilter, searchQuery]);
  
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      
      // Get admin user from localStorage
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      if (!adminUser.token) {
        navigate('/admin');
        return;
      }
      
      const response = await axios.get('http://localhost:3000/api/testimonial/admin', {
        headers: {
          Authorization: `Bearer ${adminUser.token}`
        },
        params: {
          page: currentPage,
          limit: 10,
          status: statusFilter,
          search: searchQuery || undefined
        }
      });
      
      setTestimonials(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      
      if (error.response && error.response.status === 401) {
        navigate('/admin/login');
      } else {
        setError('Terjadi kesalahan saat mengambil data testimonial');
        setLoading(false);
      }
    }
  };
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Get admin user from localStorage
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      if (!adminUser.token) {
        navigate('/admin');
        return;
      }
      
      await axios.patch(`http://localhost:3000/api/testimonial/admin/${id}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${adminUser.token}`
          }
        }
      );
      
      // Update local state
      setTestimonials(testimonials.map(testimonial => 
        testimonial.id === id 
          ? { ...testimonial, status: newStatus } 
          : testimonial
      ));
      
      setActionStatus({
        message: `Status testimonial berhasil diubah menjadi ${newStatus}`,
        type: 'success'
      });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setActionStatus({ message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      
      setActionStatus({
        message: 'Terjadi kesalahan saat mengubah status testimonial',
        type: 'danger'
      });
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus testimonial ini?')) {
      return;
    }
    
    try {
      // Get admin user from localStorage
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      if (!adminUser.token) {
        navigate('/admin');
        return;
      }
      
      await axios.delete(`http://localhost:3000/api/testimonial/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${adminUser.token}`
        }
      });
      
      // Remove from local state
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
      
      setActionStatus({
        message: 'Testimonial berhasil dihapus',
        type: 'success'
      });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setActionStatus({ message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      
      setActionStatus({
        message: 'Terjadi kesalahan saat menghapus testimonial',
        type: 'danger'
      });
    }
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when search changes
    fetchTestimonials();
  };
  
  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      </li>
    );
  }
  
  return (
    <div>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Kritik dan Saran</h1>
        </div>

        
        {actionStatus.message && (
          <div className={`alert alert-${actionStatus.type}`}>
            {actionStatus.message}
          </div>
        )}
        
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-comments me-1"></i>
            Daftar Kritik dan Saran
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="statusFilter" className="mb-1">Filter Status:</label>
                  <select 
                    id="statusFilter" 
                    className="form-select" 
                    value={statusFilter} 
                    onChange={handleStatusFilterChange}
                  >
                    <option value="all">Semua</option>
                    <option value="pending">Menunggu Persetujuan</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <form onSubmit={handleSearchSubmit}>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Cari testimonial..." 
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <button className="btn btn-primary" type="submit">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-5">
                <p className="mb-0">Tidak ada testimonial yang ditemukan</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Pesan</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((testimonial) => (
                      <tr key={testimonial.id}>
                        <td>{testimonial.id}</td>
                        <td>{testimonial.nama}</td>
                        <td>{testimonial.email || '-'}</td>
                        <td>{testimonial.pesan}</td>
                        <td>
                          <StarRating rating={testimonial.rating} readOnly={true} />
                        </td>
                        <td>
                          <span className={`badge bg-${
                            testimonial.status === 'approved' ? 'success' : 
                            testimonial.status === 'rejected' ? 'danger' : 
                            'warning'
                          }`}>
                            {testimonial.status === 'approved' ? 'Disetujui' : 
                             testimonial.status === 'rejected' ? 'Ditolak' : 
                             'Menunggu'}
                          </span>
                        </td>
                        <td>
                          {new Date(testimonial.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            {testimonial.status !== 'approved' && (
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleStatusChange(testimonial.id, 'approved')}
                                title="Setujui"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                            )}
                            
                            {testimonial.status !== 'rejected' && (
                              <button 
                                className="btn btn-sm btn-warning"
                                onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                                title="Tolak"
                              >
                                <i className="fas fa-ban"></i>
                              </button>
                            )}
                            
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(testimonial.id)}
                              title="Hapus"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {!loading && !error && testimonials.length > 0 && (
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mt-4">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Sebelumnya
                    </button>
                  </li>
                  
                  {paginationItems}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Selanjutnya
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialManagement;
