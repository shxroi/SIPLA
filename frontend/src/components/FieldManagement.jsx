import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FieldManagement = () => {
  const [lapangan, setLapangan] = useState([]);
  const [formData, setFormData] = useState({
    nama: '',
    tipe: 'futsal',
    status: 'tersedia',
    foto_url: '',
    waktu_sewa: {
      jam_mulai: '08:00',
      jam_selesai: '22:00',
      harga: 0
    }
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLapangan();
  }, []);

  const fetchLapangan = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/lapangan');
      setLapangan(response.data);
    } catch (error) {
      console.error('Error fetching lapangan:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/api/lapangan/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:3001/api/lapangan', formData);
      }
      fetchLapangan();
      resetForm();
    } catch (error) {
      console.error('Error saving lapangan:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lapangan ini?')) {
      try {
        await axios.delete(`http://localhost:3001/api/lapangan/${id}`);
        fetchLapangan();
      } catch (error) {
        console.error('Error deleting lapangan:', error);
      }
    }
  };

  const handleEdit = (lapangan) => {
    setEditingId(lapangan.id);
    setFormData({
      nama: lapangan.nama,
      tipe: lapangan.tipe,
      status: lapangan.status,
      foto_url: lapangan.foto_url,
      waktu_sewa: lapangan.waktu_sewa || {
        jam_mulai: '08:00',
        jam_selesai: '22:00',
        harga: 0
      }
    });
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      tipe: 'futsal',
      status: 'tersedia',
      foto_url: '',
      waktu_sewa: {
        jam_mulai: '08:00',
        jam_selesai: '22:00',
        harga: 0
      }
    });
    setEditingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manajemen Lapangan</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lapangan</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipe Lapangan</label>
            <select
              value={formData.tipe}
              onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
              className="input-field"
              required
            >
              <option value="futsal">Futsal</option>
              <option value="basket">Basket</option>
              <option value="voli">Voli</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input-field"
              required
            >
              <option value="tersedia">Tersedia</option>
              <option value="perbaikan">Perbaikan</option>
              <option value="tidak_tersedia">Tidak Tersedia</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">URL Foto</label>
            <input
              type="text"
              value={formData.foto_url}
              onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Jam Mulai</label>
            <input
              type="time"
              value={formData.waktu_sewa.jam_mulai}
              onChange={(e) => setFormData({
                ...formData,
                waktu_sewa: { ...formData.waktu_sewa, jam_mulai: e.target.value }
              })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Jam Selesai</label>
            <input
              type="time"
              value={formData.waktu_sewa.jam_selesai}
              onChange={(e) => setFormData({
                ...formData,
                waktu_sewa: { ...formData.waktu_sewa, jam_selesai: e.target.value }
              })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Harga Sewa</label>
            <input
              type="number"
              value={formData.waktu_sewa.harga}
              onChange={(e) => setFormData({
                ...formData,
                waktu_sewa: { ...formData.waktu_sewa, harga: parseInt(e.target.value) }
              })}
              className="input-field"
              required
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button type="submit" className="btn-primary mr-2">
            {editingId ? 'Update Lapangan' : 'Tambah Lapangan'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Batal
            </button>
          )}
        </div>
      </form>
      
      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Sewa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
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
                <td className="px-6 py-4 whitespace-nowrap">{lap.tipe}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lap.waktu_sewa?.jam_mulai} - {lap.waktu_sewa?.jam_selesai}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Rp {lap.waktu_sewa?.harga?.toLocaleString()}
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

export default FieldManagement; 