  import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Fields = () => {
  const navigate = useNavigate();
  const [lapangan, setLapangan] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    tipe: 'futsal',
    status: 'tersedia',
    foto_url: '',
    waktu_sewa: [
      {
        jam_mulai: '08:00',
        jam_selesai: '22:00',
        harga: 0
      }
    ]
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthData = () => {
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    return {
      id: adminUser.id,
      token: adminUser.token
    };
  };

  const fetchData = async () => {
    const { id, token } = getAuthData();
    if (!id || !token) {
      navigate('/admin');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/api/lapangan', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setLapangan(response.data);
    } catch (error) {
      console.error('Error fetching lapangan:', error);
      if (error.response?.status === 401) {
        navigate('/admin');
      } else {
        setError('Gagal memuat data lapangan');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWaktuSewaChange = (index, field, value) => {
    const newWaktuSewa = [...formData.waktu_sewa];
    newWaktuSewa[index] = {
      ...newWaktuSewa[index],
      [field]: field === 'harga' ? Number(value) || 0 : value
    };
    setFormData({
      ...formData,
      waktu_sewa: newWaktuSewa
    });
  };

  const addWaktuSewa = () => {
    setFormData({
      ...formData,
      waktu_sewa: [
        ...formData.waktu_sewa,
        {
          jam_mulai: '08:00',
          jam_selesai: '22:00',
          harga: 0
        }
      ]
    });
  };

  const removeWaktuSewa = (index) => {
    if (formData.waktu_sewa.length > 1) {
      const newWaktuSewa = formData.waktu_sewa.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        waktu_sewa: newWaktuSewa
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = getAuthData();
      const formDataToSend = new FormData();
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('tipe', formData.tipe);
      formDataToSend.append('status', formData.status);
      
      // Append waktu sewa as JSON string
      formDataToSend.append('waktu_sewa', JSON.stringify(formData.waktu_sewa));
      
      if (selectedImage) {
        formDataToSend.append('foto_lapangan', selectedImage);
      }

      if (editingId) {
        await axios.put(`http://localhost:3000/api/lapangan/${editingId}`, formDataToSend, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Lapangan berhasil diupdate!');
      } else {
        await axios.post('http://localhost:3000/api/lapangan', formDataToSend, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Lapangan berhasil ditambahkan!');
      }
      
      await fetchData();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response?.status === 401) {
        navigate('/admin');
      } else {
        alert('Gagal menyimpan data lapangan');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lapangan ini?')) {
      try {
        const { token } = getAuthData();
        await axios.delete(`http://localhost:3000/api/lapangan/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert('Lapangan berhasil dihapus!');
        await fetchData();
      } catch (error) {
        console.error('Error deleting lapangan:', error);
        if (error.response?.status === 401) {
          navigate('/admin');
        } else {
          alert('Terjadi kesalahan saat menghapus data');
        }
      }
    }
  };

  const handleEdit = (lapangan) => {
    setFormData({
      nama: lapangan.nama,
      tipe: lapangan.tipe,
      status: lapangan.status,
      foto_url: lapangan.foto_url,
      waktu_sewa: Array.isArray(lapangan.waktu_sewa) ? lapangan.waktu_sewa : [lapangan.waktu_sewa]
    });
    setEditingId(lapangan.id);
    setPreviewImage(lapangan.foto_url);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      tipe: 'futsal',
      status: 'tersedia',
      foto_url: '',
      waktu_sewa: [
        {
          jam_mulai: '08:00',
          jam_selesai: '22:00',
          harga: 0
        }
      ]
    });
    setEditingId(null);
    setSelectedImage(null);
    setPreviewImage('');
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kelola Lapangan</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) resetForm();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Tutup Form' : 'Tambah Lapangan'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lapangan</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipe Lapangan</label>
              <select
                value={formData.tipe}
                onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="futsal">Futsal</option>
                <option value="basket">Basket</option>
                <option value="voli">Voli</option>
                <option value="badminton">Badminton</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="tersedia">Tersedia</option>
                <option value="perbaikan">Perbaikan</option>
                <option value="penuh">Penuh</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Foto Lapangan</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 h-32 w-32 object-cover rounded-md"
                />
              )}
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Waktu Sewa</label>
                <button
                  type="button"
                  onClick={addWaktuSewa}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  + Tambah Waktu
                </button>
              </div>
              
              {formData.waktu_sewa.map((waktu, index) => (
                <div key={index} className="flex gap-4 items-end mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600">Jam Mulai</label>
                    <input
                      type="time"
                      value={waktu.jam_mulai || '08:00'}
                      onChange={(e) => handleWaktuSewaChange(index, 'jam_mulai', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600">Jam Selesai</label>
                    <input
                      type="time"
                      value={waktu.jam_selesai || '22:00'}
                      onChange={(e) => handleWaktuSewaChange(index, 'jam_selesai', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600">Harga</label>
                    <input
                      type="number"
                      value={waktu.harga || 0}
                      onChange={(e) => handleWaktuSewaChange(index, 'harga', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>
                  {formData.waktu_sewa.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWaktuSewa(index)}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingId ? 'Update Lapangan' : 'Simpan Lapangan'}
            </button>
          </div>
        </form>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu & Harga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lapangan.map((lap) => (
              <tr key={lap.id}>
                <td className="px-6 py-4 whitespace-nowrap">{lap.nama}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lap.foto_url && (
                    <img src={lap.foto_url} alt={lap.nama} className="h-10 w-10 rounded-full object-cover" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{lap.tipe}</td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {Array.isArray(lap.waktu_sewa) && lap.waktu_sewa.map((waktu, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{waktu.jam_mulai} - {waktu.jam_selesai}</span>
                        <br />
                        <span className="text-gray-500">
                          Rp {waktu.harga?.toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    lap.status === 'tersedia' ? 'bg-green-100 text-green-800' :
                    lap.status === 'perbaikan' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lap.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(lap)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lap.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fields;