import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/tq1-landing.css';

function MemberLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state; // Data booking dari halaman sebelumnya (jika ada)
  
  const [formData, setFormData] = useState({
    no_telepon: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Kirim data login
      const response = await axios.post('http://localhost:3000/api/member/login', {
        no_telepon: formData.no_telepon,
        password: formData.password
      });
      
      // Simpan token dan data member ke localStorage
      localStorage.setItem('memberToken', response.data.token);
      localStorage.setItem('memberUser', JSON.stringify(response.data.member));
      
      // Redirect ke halaman member atau booking jika ada data booking
      if (bookingData) {
        navigate('/member/booking', { state: bookingData });
      } else {
        navigate('/member/dashboard');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      
      // Handle expired membership
      if (error.response?.data?.expired) {
        setError('Membership Anda telah berakhir. Silakan perpanjang membership Anda.');
      } else {
        setError(error.response?.data?.message || 'Terjadi kesalahan saat login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Branding */}
            <div className="md:w-2/5 bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-4">TQ1 Sports</h1>
                <p className="text-sm opacity-80 mb-8 text-white">Login to your account to access our premium badminton courts and manage your membership.</p>
              </div>
              
              <div className="text-center">
                <img src="/src/assets/images/badminton.png" alt="Badminton" className="w-48 h-48 mx-auto mb-10" />
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-blue-600 py-3 px-6 rounded-full w-full transition duration-300">
                  LOGIN NOW
                </button>
              </div>
              
              <div className="mt-8 text-xs text-center opacity-70">
                <p className="text-white">© 2025 TQ1 Sports Field. All rights reserved.</p>
              </div>
            </div>
            
            {/* Right side - Form */}
            <div className="md:w-3/5 p-8 flex flex-col justify-center">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Login</h2>
                <p className="text-sm text-gray-500">Welcome back! Login to your account</p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="no_telepon">
                    Nomor Telepon
                  </label>
                  <input
                    id="no_telepon"
                    name="no_telepon"
                    type="text"
                    value={formData.no_telepon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nomor telepon Anda"
                    required
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
                      Password
                    </label>
                    <a href="#" className="text-xs text-blue-600 hover:underline">Lupa Password?</a>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan password"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
                    Ingat saya
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-medium py-2 px-4 rounded-md transition duration-300 ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  {loading ? 'Memproses...' : 'Login'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Belum memiliki akun? {' '}
                  <Link to="/member/register" className="text-blue-600 hover:underline">
                    Daftar di sini
                  </Link>
                </p>
              </div>
              
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Atau login dengan</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <span className="sr-only">Google</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                    </svg>
                  </button>
                  <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberLogin;
