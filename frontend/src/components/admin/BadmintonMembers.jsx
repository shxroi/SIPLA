import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX, FiRefreshCw } from 'react-icons/fi';

const BadmintonMembers = () => {
  const [members, setMembers] = useState([]);
  const [lapangan, setLapangan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    nama: '',
    no_telepon: '',
    email: '',
    password: '', // For new members only
    lapangan_id: '',
    tanggal_mulai: new Date().toISOString().split('T')[0],
    tanggal_berakhir: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    jam_mulai: '19:00',
    jam_selesai: '21:00',
    tipe: 'bulutangkis',
    status: 'aktif'
  });

  // Fungsi untuk mengambil data member bulutangkis
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      const response = await axios.get('http://localhost:3000/api/member', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Mengakses data dari respons API dengan format yang benar
      if (response.data && response.data.data) {
        setMembers(response.data.data);
      } else {
        setMembers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil data lapangan bulutangkis
  const fetchLapangan = async () => {
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      // Menggunakan endpoint public yang tidak memerlukan autentikasi
      const response = await axios.get('http://localhost:3000/api/lapangan/public', {
        params: { tipe: 'bulutangkis' }
      });
      
      // Mengakses data dari respons API dengan format yang benar
      if (response.data) {
        // Filter hanya lapangan dengan tipe bulutangkis
        const bulutangkisFields = Array.isArray(response.data) 
          ? response.data.filter(field => field.tipe === 'bulutangkis')
          : [];
        setLapangan(bulutangkisFields);
        console.log('Lapangan bulutangkis:', bulutangkisFields);
      } else {
        setLapangan([]);
      }
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchLapangan();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      nama: '',
      no_telepon: '',
      email: '',
      password: '', // Reset password field
      lapangan_id: '',
      tanggal_mulai: new Date().toISOString().split('T')[0],
      tanggal_berakhir: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      jam_mulai: '19:00',
      jam_selesai: '21:00',
      tipe: 'bulutangkis',
      status: 'aktif'
    });
    setEditingId(null);
    setFormError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      // Prepare member data
      let memberData = {
        ...formData,
        lapangan_id: formData.lapangan_id ? parseInt(formData.lapangan_id) : null,
        tipe: 'bulutangkis'
      };

      // Format phone number if needed
      const phoneNumber = memberData.no_telepon.startsWith('0') ? 
        memberData.no_telepon.slice(1) : 
        memberData.no_telepon;
      memberData.no_telepon = phoneNumber;
      
      // Validate required fields
      if (!memberData.nama || !memberData.no_telepon || !memberData.lapangan_id || 
          !memberData.tanggal_mulai || !memberData.tanggal_berakhir || 
          !memberData.jam_mulai || !memberData.jam_selesai) {
        setFormError('Mohon lengkapi semua field yang wajib diisi');
        return;
      }

      // Validate phone number format
      const phoneRegex = /^[0-9]{10,13}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setFormError('Format nomor telepon tidak valid');
        return;
      }

      // Validate membership dates
      const startDate = new Date(memberData.tanggal_mulai);
      const endDate = new Date(memberData.tanggal_berakhir);
      if (startDate >= endDate) {
        setFormError('Tanggal berakhir harus lebih besar dari tanggal mulai');
        return;
      }

      // Validate time slots
      const startTime = memberData.jam_mulai.split(':').map(Number);
      const endTime = memberData.jam_selesai.split(':').map(Number);
      if (startTime[0] > endTime[0] || (startTime[0] === endTime[0] && startTime[1] >= endTime[1])) {
        setFormError('Jam selesai harus lebih besar dari jam mulai');
        return;
      }

      // Auto-generate email if not provided
      if (!memberData.email) {
        memberData.email = `member_${phoneNumber}@tq1sports.com`;
      } else {
        // Validate email format if provided
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(memberData.email)) {
          setFormError('Format email tidak valid');
          return;
        }
      }

      if (editingId) {
        // Update existing member (exclude password)
        const { password, ...updateData } = memberData;
        await axios.put(`http://localhost:3000/api/member/${editingId}`, updateData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // For new member, password is required
        if (!memberData.password) {
          setFormError('Password wajib diisi untuk member baru');
          return;
        }
        if (memberData.password.length < 6) {
          setFormError('Password minimal 6 karakter');
          return;
        }
        
        // Create new member
        await axios.post('http://localhost:3000/api/member', memberData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Refresh data
      fetchMembers();
      
      // Reset form and close it
      resetForm();
      setShowForm(false);
      
    } catch (error) {
      console.error('Error saving member:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setFormError(errorMessage);
    }
  };

  // Handle edit member
  const handleEdit = (member) => {
    setEditingId(member.id);
    
    setFormData({
      nama: member.nama,
      no_telepon: member.no_telepon,
      email: member.email || '',
      lapangan_id: member.lapangan_id,
      tanggal_mulai: member.tanggal_mulai,
      tanggal_berakhir: member.tanggal_berakhir || member.tanggal_berakhir,
      jam_mulai: member.jam_mulai || '19:00',
      jam_selesai: member.jam_selesai || '21:00',
      status: member.status || 'aktif'
    });
    
    setShowForm(true);
  };

  // Handle delete member
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus member ini?')) {
      return;
    }
    
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      await axios.delete(`http://localhost:3000/api/member/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh data
      fetchMembers();
      
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Terjadi kesalahan saat menghapus member.');
    }
  };

  // Handle perpanjangan member
  const handlePerpanjangan = async (member) => {
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      // Hitung tanggal berakhir baru (1 bulan dari tanggal berakhir saat ini)
      const currentEndDate = new Date(member.tanggal_berakhir || member.tanggal_berakhir);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setMonth(newEndDate.getMonth() + 1);
      
      const formattedNewEndDate = newEndDate.toISOString().split('T')[0];
      
      // Update member dengan tanggal berakhir baru
      await axios.put(`http://localhost:3000/api/member/${member.id}`, {
        ...member,
        tanggal_berakhir: formattedNewEndDate
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh data
      fetchMembers();
      
      alert(`Keanggotaan ${member.nama} berhasil diperpanjang hingga ${formattedNewEndDate}`);
      
    } catch (error) {
      console.error('Error extending membership:', error);
      alert('Terjadi kesalahan saat memperpanjang keanggotaan.');
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get lapangan name by id
  const getLapanganName = (id) => {
    const field = lapangan.find(l => l.id === id);
    return field ? field.nama : 'Tidak diketahui';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Manajemen Member Bulutangkis</h2>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? (
            <>
              <FiX className="mr-2" /> Batal
            </>
          ) : (
            <>
              <FiPlus className="mr-2" /> Tambah Member
            </>
          )}
        </button>
      </div>
      
      {/* Form tambah/edit member */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-md mb-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? 'Edit Member Bulutangkis' : 'Tambah Member Bulutangkis'}
          </h3>
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Member</label>
                <input 
                  type="text" 
                  name="nama"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.nama}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <input 
                  type="text" 
                  name="no_telepon"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.no_telepon}
                  onChange={handleInputChange}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Format: 10-13 digit angka</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lapangan</label>
                <select 
                  name="lapangan_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.lapangan_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Pilih Lapangan</option>
                  {lapangan.map(field => (
                    <option key={field.id} value={field.id}>
                      {field.nama} - Lapangan {field.nomor_lapangan || 1}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="aktif">Aktif</option>
                  <option value="tidak_aktif">Tidak Aktif</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                <input 
                  type="date" 
                  name="tanggal_mulai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.tanggal_mulai}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                />
                <p className="mt-1 text-sm text-gray-500">Opsional. Akan di-generate otomatis jika kosong.</p>
              </div>

              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimal 6 karakter"
                    minLength="6"
                    required={!editingId}
                  />
                  <p className="mt-1 text-sm text-gray-500">Minimal 6 karakter. Hanya untuk member baru.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                <input 
                  type="date" 
                  name="tanggal_berakhir"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.tanggal_berakhir}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                <input 
                  type="time" 
                  name="jam_mulai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.jam_mulai}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                <input 
                  type="time" 
                  name="jam_selesai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.jam_selesai}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            {formError && (
              <div className="mb-4 text-red-600 text-sm">
                {formError}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button 
                type="button" 
                className="mr-3 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
              >
                <FiSave className="mr-2" /> Simpan
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Daftar member */}
      {loading ? (
        <div className="text-center py-10">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Telepon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lapangan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam Main</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Mulai</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Selesai</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada data member bulutangkis.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{member.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{member.no_telepon}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.email || `member_${member.no_telepon}@tq1sports.com`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getLapanganName(member.lapangan_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{member.jam_mulai} - {member.jam_selesai}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(member.tanggal_mulai)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(member.tanggal_berakhir || member.tanggal_berakhir)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${member.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                        onClick={() => handleEdit(member)}
                        title="Edit member"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 mr-2"
                        onClick={() => handlePerpanjangan(member)}
                        title="Perpanjang membership"
                      >
                        <FiRefreshCw />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(member.id)}
                        title="Hapus member"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BadmintonMembers;
