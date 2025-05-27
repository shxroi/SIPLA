import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MemberProfile() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nama: '',
    no_telepon: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in
    const memberToken = localStorage.getItem('memberToken');
    if (!memberToken) {
      navigate('/member/login');
      return;
    }
    
    // Fetch member profile
    const fetchMemberProfile = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get('http://localhost:3000/api/member/profile', {
          headers: { 'Authorization': `Bearer ${memberToken}` }
        });
        
        setMemberData(response.data);
        setFormData({
          nama: response.data.nama || '',
          no_telepon: response.data.no_telepon || '',
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching member profile:', error);
        setError('Terjadi kesalahan saat mengambil data profil');
        setLoading(false);
        
        // If token is invalid, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('memberToken');
          localStorage.removeItem('memberUser');
          navigate('/member/login');
        }
      }
    };
    
    fetchMemberProfile();
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(null);
    
    // Validate password if changing
    if (formData.new_password || formData.current_password) {
      if (!formData.current_password) {
        setError('Password saat ini wajib diisi untuk mengubah password');
        setUpdating(false);
        return;
      }
      
      if (!formData.new_password) {
        setError('Password baru wajib diisi');
        setUpdating(false);
        return;
      }
      
      if (formData.new_password !== formData.confirm_password) {
        setError('Password baru dan konfirmasi password tidak sama');
        setUpdating(false);
        return;
      }
    }
    
    try {
      const memberToken = localStorage.getItem('memberToken');
      
      // Prepare update data
      const updateData = {
        nama: formData.nama,
        no_telepon: formData.no_telepon
      };
      
      // Add password data if changing
      if (formData.current_password && formData.new_password) {
        updateData.current_password = formData.current_password;
        updateData.new_password = formData.new_password;
      }
      
      // Update profile
      const response = await axios.put('http://localhost:3000/api/member/profile', updateData, {
        headers: { 'Authorization': `Bearer ${memberToken}` }
      });
      
      // Update local storage with new data
      localStorage.setItem('memberUser', JSON.stringify(response.data.member));
      
      setSuccess('Profil berhasil diupdate');
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat mengupdate profil');
    } finally {
      setUpdating(false);
    }
  };
  
  const handleBack = () => {
    navigate('/member/dashboard');
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profil Member</h1>
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama">
                  Nama Lengkap
                </label>
                <input
                  id="nama"
                  name="nama"
                  type="text"
                  value={formData.nama}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="no_telepon">
                  Nomor Telepon
                </label>
                <div className="flex">
                  <div className="bg-gray-100 border border-r-0 rounded-l px-3 py-2 text-gray-700">
                    +62
                  </div>
                  <input
                    id="no_telepon"
                    name="no_telepon"
                    type="tel"
                    value={formData.no_telepon}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded-r w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="8123456789"
                  />
                </div>
              </div>
              
              <div className="mt-8 mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ubah Password</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Biarkan kosong jika tidak ingin mengubah password
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current_password">
                  Password Saat Ini
                </label>
                <input
                  id="current_password"
                  name="current_password"
                  type="password"
                  value={formData.current_password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Masukkan password saat ini"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new_password">
                  Password Baru
                </label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={formData.new_password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Masukkan password baru"
                  minLength="6"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm_password">
                  Konfirmasi Password Baru
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Konfirmasi password baru"
                  minLength="6"
                />
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={updating}
                  className={`w-full py-3 rounded-lg font-bold ${
                    updating
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {updating ? 'Memproses...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informasi Membership</h2>
              
              {memberData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Status:</p>
                    <p className={`font-medium ${memberData.status === 'aktif' ? 'text-green-600' : 'text-red-600'}`}>
                      {memberData.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tanggal Mulai:</p>
                    <p className="font-medium">
                      {new Date(memberData.tanggal_mulai).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tanggal Berakhir:</p>
                    <p className="font-medium">
                      {new Date(memberData.tanggal_selesai).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Lapangan:</p>
                    <p className="font-medium">{memberData.lapangan_nama || 'Tidak ada'}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Untuk perpanjangan membership, silakan hubungi admin TQ1 Sports Field.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberProfile;
