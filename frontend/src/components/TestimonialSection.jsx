import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

function TestimonialSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: '',
    rating: 5
  });
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/testimonial/public');
      setTestimonials(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Gagal memuat testimonial');
      setLoading(false);
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
        rating: 5
      });
      
      // Refresh testimonials after 2 seconds
      setTimeout(() => {
        fetchTestimonials();
      }, 2000);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || 'Terjadi kesalahan saat mengirim testimonial'
      });
    }
  };

  return (
    <section className="testimonial section" id="testimonial">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-12 text-center mb-5">
            <h2 className="section-title">Kesan & Pesan</h2>
            <p className="section-sub-title">Bagikan pengalaman Anda bermain di TQ1 Sports</p>
          </div>

          {/* Testimonial List */}
          <div className="col-lg-12 col-12 mb-5">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : testimonials.length === 0 ? (
              <div className="text-center">
                <p>Belum ada testimonial. Jadilah yang pertama!</p>
              </div>
            ) : (
              <div className="row testimonial-list">
                {testimonials.slice(0, 3).map((testimonial) => (
                  <div key={testimonial.id} className="col-lg-4 col-md-6 col-12 mb-4">
                    <div className="testimonial-item p-4 h-100 bg-white shadow-sm rounded">
                      <div className="testimonial-content">
                        <div className="testimonial-rating mb-3">
                          <StarRating rating={testimonial.rating} readOnly={true} />
                        </div>
                        <p className="testimonial-text mb-4">"{testimonial.pesan}"</p>
                        <div className="testimonial-author mt-3 d-flex align-items-center">
                          <div className="testimonial-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                            {testimonial.nama.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="mb-0 fs-6">{testimonial.nama}</h5>
                            <small className="text-muted">
                              {new Date(testimonial.created_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Testimonial Form */}
          <div className="col-lg-8 col-md-10 mx-auto col-12">
            <div className="testimonial-form-container">
              <h3 className="mb-4">Bagikan Pengalaman Anda</h3>
              
              {submitStatus.message && (
                <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'} mb-4`}>
                  {submitStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="testimonial-form">
                <div className="form-group mb-3">
                  <label htmlFor="nama">Nama <span className="text-danger">*</span></label>
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
                
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
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
                
                <div className="form-group mb-3">
                  <label htmlFor="rating">Rating</label>
                  <div>
                    <StarRating 
                      rating={formData.rating} 
                      onRatingChange={handleRatingChange} 
                      readOnly={false}
                    />
                  </div>
                </div>
                
                <div className="form-group mb-4">
                  <label htmlFor="pesan">Pesan <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    id="pesan"
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Bagikan pengalaman Anda bermain di TQ1 Sports"
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="custom-btn bg-color">
                  Kirim Testimonial
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
