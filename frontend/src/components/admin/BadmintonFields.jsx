import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';

const BadmintonFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState({
    nama: '',
    nomor_lapangan: 1,
    tipe: 'bulutangkis',
    status: 'tersedia',
    foto_url: '',
    waktu_sewa: [
      {
        kategori_waktu: 'sesi1',
        jam_mulai: '08:00',
        jam_selesai: '11:00',
        harga: 200000
      },
      {
        kategori_waktu: 'sesi2',
        jam_mulai: '11:00',
        jam_selesai: '14:00',
        harga: 200000
      },
      {
        kategori_waktu: 'sesi3',
        jam_mulai: '14:00',
        jam_selesai: '17:00',
        harga: 200000
      },
      {
        kategori_waktu: 'sesi4',
        jam_mulai: '17:00',
        jam_selesai: '20:00',
        harga: 200000
      },
      {
        kategori_waktu: 'sesi5',
        jam_mulai: '20:00',
        jam_selesai: '23:00',
        harga: 200000
      }
    ]
  });

  // Fungsi untuk mengambil data lapangan bulutangkis
  const fetchFields = async () => {
    try {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      // Menggunakan endpoint yang sudah ada dengan filter tipe=bulutangkis
      const response = await axios.get('http://localhost:3000/api/lapangan', {
        params: { tipe: 'bulutangkis' },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setFields(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle waktu sewa input change
  const handleWaktuSewaChange = (index, field, value) => {
    const newWaktuSewa = [...formData.waktu_sewa];
    newWaktuSewa[index][field] = field === 'harga' ? parseInt(value) : value;
    setFormData({
      ...formData,
      waktu_sewa: newWaktuSewa
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      nama: '',
      nomor_lapangan: 1,
      tipe: 'bulutangkis',
      status: 'tersedia',
      foto_url: '',
      waktu_sewa: [
        {
          kategori_waktu: 'sesi1',
          jam_mulai: '08:00',
          jam_selesai: '11:00',
          harga: 200000
        },
        {
          kategori_waktu: 'sesi2',
          jam_mulai: '11:00',
          jam_selesai: '14:00',
          harga: 200000
        },
        {
          kategori_waktu: 'sesi3',
          jam_mulai: '14:00',
          jam_selesai: '17:00',
          harga: 200000
        },
        {
          kategori_waktu: 'sesi4',
          jam_mulai: '17:00',
          jam_selesai: '20:00',
          harga: 200000
        },
        {
          kategori_waktu: 'sesi5',
          jam_mulai: '20:00',
          jam_selesai: '23:00',
          harga: 200000
        }
      ]
    });
    setSelectedImage(null);
    setPreviewImage('');
    setEditingId(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append('nama', formData.nama);
      formDataObj.append('nomor_lapangan', formData.nomor_lapangan);
      formDataObj.append('tipe', formData.tipe);
      formDataObj.append('status', formData.status);
      formDataObj.append('waktu_sewa', JSON.stringify(formData.waktu_sewa));
      
      if (selectedImage) {
        formDataObj.append('foto', selectedImage);
      }
      
      if (editingId) {
        // Update existing field
        await axios.put(`http://localhost:3000/api/lapangan/${editingId}`, formDataObj, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new field
        await axios.post('http://localhost:3000/api/lapangan', formDataObj, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Refresh data
      fetchFields();
      
      // Reset form and close it
      resetForm();
      setShowForm(false);
      
    } catch (error) {
      console.error('Error saving field:', error);
      alert('Terjadi kesalahan saat menyimpan data lapangan.');
    }
  };

  // Handle edit field
  const handleEdit = (field) => {
    setEditingId(field.id);
    
    // Map the field data to formData
    const fieldWaktuSewa = field.waktu_sewa || [];
    
    // Prepare default sesi
    const defaultSesi = [
      {
        kategori_waktu: 'sesi1',
        jam_mulai: '08:00',
        jam_selesai: '11:00',
        harga: 200000
      },
      {
        kategori_waktu: 'sesi2',
        jam_mulai: '11:00',
        jam_selesai: '14:00',
        harga: 200000
      },
      {
        kategori_waktu: 'sesi3',
        jam_mulai: '14:00',
        jam_selesai: '17:00',
        harga: 200000
      },
      {
        kategori_waktu: 'sesi4',
        jam_mulai: '17:00',
        jam_selesai: '20:00',
        harga: 200000
      },
      {
        kategori_waktu: 'sesi5',
        jam_mulai: '20:00',
        jam_selesai: '23:00',
        harga: 200000
      }
    ];
    
    // Map existing waktu_sewa or use defaults
    const waktuSewa = defaultSesi.map((defaultItem) => {
      const existingItem = fieldWaktuSewa.find(w => w.kategori_waktu === defaultItem.kategori_waktu);
      return existingItem || defaultItem;
    });
    
    setFormData({
      nama: field.nama,
      nomor_lapangan: field.nomor_lapangan || 1,
      tipe: 'bulutangkis',
      status: field.status || 'tersedia',
      foto_url: field.foto_lapangan || '',
      waktu_sewa: waktuSewa
    });
    
    if (field.foto_lapangan) {
      setPreviewImage(`http://localhost:3000/uploads/${field.foto_lapangan}`);
    }
    
    setShowForm(true);
  };

  // Handle delete field
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus lapangan ini?')) {
      return;
    }
    
    try {
      const { token } = JSON.parse(localStorage.getItem('adminUser') || '{}');
      
      await axios.delete(`http://localhost:3000/api/lapangan/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh data
      fetchFields();
      
    } catch (error) {
      console.error('Error deleting field:', error);
      alert('Terjadi kesalahan saat menghapus lapangan.');
    }
  };

  // Format sesi name
  const formatSesiName = (sesi) => {
    const sesiMap = {
      'sesi1': 'Sesi 1 (08:00-11:00)',
      'sesi2': 'Sesi 2 (11:00-14:00)',
      'sesi3': 'Sesi 3 (14:00-17:00)',
      'sesi4': 'Sesi 4 (17:00-20:00)',
      'sesi5': 'Sesi 5 (20:00-23:00)'
    };
    
    return sesiMap[sesi] || sesi;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Manajemen Lapangan Bulutangkis</h2>
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
              <FiPlus className="mr-2" /> Tambah Lapangan
            </>
          )}
        </button>
      </div>
      
      {/* Form tambah/edit lapangan */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-md mb-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? 'Edit Lapangan Bulutangkis' : 'Tambah Lapangan Bulutangkis'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lapangan</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Lapangan</label>
                <select 
                  name="nomor_lapangan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.nomor_lapangan}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: 'nomor_lapangan',
                      value: parseInt(e.target.value)
                    }
                  })}
                  required
                >
                  <option value={1}>Lapangan 1</option>
                  <option value={2}>Lapangan 2</option>
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
                  <option value="tersedia">Tersedia</option>
                  <option value="tidak_tersedia">Tidak Tersedia</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Lapangan</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleImageChange}
                />
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="h-32 w-auto object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <h4 className="text-md font-medium mt-6 mb-3">Pengaturan Sesi dan Harga</h4>
            <div className="space-y-4">
              {formData.waktu_sewa.map((waktu, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 border border-gray-200 rounded-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sesi</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      value={formatSesiName(waktu.kategori_waktu)}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={waktu.jam_mulai}
                      onChange={(e) => handleWaktuSewaChange(index, 'jam_mulai', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={waktu.jam_selesai}
                      onChange={(e) => handleWaktuSewaChange(index, 'jam_selesai', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={waktu.harga}
                      onChange={(e) => handleWaktuSewaChange(index, 'harga', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
            
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
      
      {/* Daftar lapangan */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sesi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Tidak ada data lapangan bulutangkis.
                  </td>
                </tr>
              ) : (
                fields.map((field) => (
                  <tr key={field.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{field.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{field.nomor_lapangan || 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${field.status === 'tersedia' ? 'bg-green-100 text-green-800' : 
                          field.status === 'tidak_tersedia' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {field.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="list-disc pl-5 text-xs">
                        {field.waktu_sewa && field.waktu_sewa.map((sesi, idx) => (
                          <li key={idx}>
                            {`${sesi.jam_mulai} - ${sesi.jam_selesai}`}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {field.waktu_sewa && field.waktu_sewa.length > 0
                        ? `Rp ${field.waktu_sewa[0].harga.toLocaleString('id-ID')}/sesi`
                        : 'Rp 200.000/sesi'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {field.foto_lapangan ? (
                        <img 
                          src={`http://localhost:3000/uploads/${field.foto_lapangan}`} 
                          alt={field.nama}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => handleEdit(field)}
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(field.id)}
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

export default BadmintonFields;
