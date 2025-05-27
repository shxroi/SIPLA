import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function FieldList() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'futsal', 'badminton'

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/lapangan/public');
      setFields(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setLoading(false);
    }
  };

  const filteredFields = activeTab === 'all' 
    ? fields 
    : fields.filter(field => field.tipe === activeTab);

  // Function to get the lowest price from waktu_sewa
  const getLowestPrice = (waktuSewa) => {
    if (!waktuSewa || waktuSewa.length === 0) return 0;
    return Math.min(...waktuSewa.map(ws => ws.harga));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Daftar Lapangan</h1>
      
      {/* Tabs for filtering */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-4 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Semua
        </button>
        <button
          onClick={() => setActiveTab('futsal')}
          className={`py-2 px-4 font-medium ${activeTab === 'futsal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Futsal
        </button>
        <button
          onClick={() => setActiveTab('bulutangkis')}
          className={`py-2 px-4 font-medium ${activeTab === 'bulutangkis' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Bulutangkis
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => {
            const lowestPrice = getLowestPrice(field.waktu_sewa);
            return (
              <div key={field.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                  src={field.foto_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={field.nama}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {field.nama}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">
                    {field.jenis_lapangan || field.tipe} • Lapangan {field.nomor_lapangan || ''}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-red-600">
                        Rp {lowestPrice.toLocaleString('id-ID')}
                      </span>
                      <span className="text-sm text-gray-500"> / jam</span>
                    </div>
                    <Link
                      to={`/field/${field.id}`}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                      aria-label={`Lihat detail ${field.nama}`}
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {filteredFields.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">Tidak ada lapangan yang tersedia</p>
        </div>
      )}
    </div>
  );
}

export default FieldList;