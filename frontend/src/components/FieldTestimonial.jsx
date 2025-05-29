import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

function FieldTestimonial({ lapanganId, lapanganNama }) {
  const [testimonials, setTestimonials] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: '',
    lapangan_id: lapanganId,
    rating: 5
  });
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTestimonials();
    fetchAverageRating();
  }, [lapanganId]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state before fetching
      
      // Explicitly set status=approved in the query params
      const response = await axios.get(`http://localhost:3000/api/testimonial/field/${lapanganId}`, {
        params: {
          status: 'approved',
          limit: 10,
          page: 1
        }
      });
      
      if (response.data && response.data.data) {
        setTestimonials(response.data.data);
      } else {
        setTestimonials([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Gagal memuat testimonial. Silakan coba lagi nanti.');
      setTestimonials([]); // Set empty array on error
      setLoading(false);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/testimonial/field/${lapanganId}/rating`);
      
      if (response.data && response.data.average_rating !== undefined) {
        setAverageRating(response.data.average_rating || 0);
        setTotalReviews(response.data.total_reviews || 0);
      } else {
        setAverageRating(0);
        setTotalReviews(0);
      }
    } catch (error) {
      console.error('Error fetching average rating:', error);
      setAverageRating(0);
      setTotalReviews(0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRatingChange = (newRating) => {
    setFormData({
      ...formData,
      rating: newRating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/api/testimonial', {
        ...formData,
        lapangan_id: lapanganId
      });
      
      setSubmitStatus({
        success: true,
        message: 'Terima kasih! Ulasan Anda telah dikirim dan sedang menunggu persetujuan.'
      });
      
      // Reset form
      setFormData({
        nama: '',
        email: '',
        pesan: '',
        lapangan_id: lapanganId,
        rating: 5
      });
      
      // Refresh average rating
      fetchAverageRating();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setSubmitStatus({
        success: false,
        message: 'Terjadi kesalahan saat mengirim ulasan. Silakan coba lagi.'
      });
    }
  };

  return (
    <div className="testimonial-section mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-1">Ulasan Pengguna</h4>
          <div className="d-flex align-items-center">
            <StarRating rating={averageRating} readOnly={true} />
            <span className="ms-2">
              <strong>{averageRating.toFixed(1)}</strong>/5 ({totalReviews} ulasan)
            </span>
          </div>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Tutup Form' : 'Tulis Ulasan'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="testimonial-form mb-4 p-3 border rounded">
          {submitStatus.success ? (
            <div className="alert alert-success">
              {submitStatus.message}
              <button 
                className="btn btn-sm btn-outline-success ms-2"
                onClick={() => {
                  setSubmitStatus({ success: false, message: '' });
                }}
              >
                Tulis Ulasan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nama" className="form-label">Nama <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama Anda"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email Anda (opsional)"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="rating" className="form-label">Rating</label>
                <div>
                  <StarRating 
                    rating={formData.rating} 
                    onRatingChange={handleRatingChange} 
                    readOnly={false}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="pesan" className="form-label">Pesan <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  id="pesan"
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder={`Bagikan pengalaman Anda bermain di lapangan ${lapanganNama}`}
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary">
                Kirim Ulasan
              </button>
            </form>
          )}
        </div>
      )}

      {/* Testimonial List */}
      <div className="testimonial-list">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-4 border rounded p-3 bg-light">
            <p className="mb-0">Belum ada ulasan untuk lapangan ini. Jadilah yang pertama memberikan ulasan!</p>
          </div>
        ) : (
          <div className="testimonial-items">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-item mb-3 p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center">
                    <div className="testimonial-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                      {testimonial.nama.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="mb-0">{testimonial.nama}</h6>
                      <small className="text-muted">
                        {new Date(testimonial.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </small>
                    </div>
                  </div>
                  <StarRating rating={testimonial.rating} readOnly={true} />
                </div>
                <p className="testimonial-text mb-0">{testimonial.pesan}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FieldTestimonial;
