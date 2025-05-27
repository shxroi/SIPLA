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
      const response = await axios.get(`http://localhost:3000/api/testimonial/field/${lapanganId}`);
      setTestimonials(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Gagal memuat testimonial');
      setLoading(false);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/testimonial/field/${lapanganId}/rating`);
      setAverageRating(response.data.average_rating);
      setTotalReviews(response.data.total_reviews);
    } catch (error) {
      console.error('Error fetching average rating:', error);
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
    
    // Validasi form
    if (!formData.nama || !formData.pesan) {
      setSubmitStatus({
        success: false,
        message: 'Nama dan pesan wajib diisi'
      });
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/api/testimonial', formData);
      
      setSubmitStatus({
        success: true,
        message: response.data.message
      });
      
      // Reset form
      setFormData({
        nama: '',
        email: '',
        pesan: '',
        lapangan_id: lapanganId,
        rating: 5
      });
      
      // Refresh testimonials after 2 seconds
      setTimeout(() => {
        fetchTestimonials();
        fetchAverageRating();
        setShowForm(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || 'Terjadi kesalahan saat mengirim testimonial'
      });
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    // Reset status message when toggling form
    setSubmitStatus({
      success: false,
      message: ''
    });
  };

  return (
    <div className="field-testimonial-container">
      <div className="field-rating-summary mb-4">
        <h4 className="mb-3">Ulasan Pengguna</h4>
        <div className="d-flex align-items-center">
          <div className="rating-number me-3">
            <span className="display-4 fw-bold">{averageRating}</span>
            <span className="text-muted">/5</span>
          </div>
          <div className="rating-stars">
            <StarRating rating={parseFloat(averageRating)} readOnly={true} />
            <div className="text-muted mt-1">{totalReviews} ulasan</div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Kesan & Pesan</h5>
        <button 
          className="btn btn-primary btn-sm" 
          onClick={toggleForm}
        >
          {showForm ? 'Tutup Form' : 'Tulis Ulasan'}
        </button>
      </div>

      {/* Form Testimonial */}
      {showForm && (
        <div className="testimonial-form-container mb-4 p-3 border rounded bg-light">
          {submitStatus.message && (
            <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'} mb-3`}>
              {submitStatus.message}
            </div>
          )}
          
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
          <div className="text-center py-4">
            <p className="text-muted mb-0">Belum ada ulasan untuk lapangan ini</p>
            <button 
              className="btn btn-outline-primary mt-2" 
              onClick={() => setShowForm(true)}
            >
              Jadilah yang pertama mengulas
            </button>
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
