import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ScheduleTable() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'futsal', 'badminton'

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/booking/weekly-schedule');
        setScheduleData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setError('Terjadi kesalahan saat mengambil jadwal lapangan');
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getFilteredFields = () => {
    if (!scheduleData) return [];
    
    if (activeTab === 'all') {
      return scheduleData.fields;
    }
    
    return scheduleData.fields.filter(field => field.tipe === activeTab);
  };

  const getStatusColor = (status) => {
    return status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Filter Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-3 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('all')}
        >
          Semua Lapangan
        </button>
        <button
          className={`px-4 py-3 font-medium ${activeTab === 'futsal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('futsal')}
        >
          Futsal
        </button>
        <button
          className={`px-4 py-3 font-medium ${activeTab === 'badminton' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('badminton')}
        >
          Badminton
        </button>

      </div>

      {/* Schedule Table */}
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Lapangan</th>
              {scheduleData && scheduleData.dates.map((date, index) => (
                <th key={index} className="py-3 px-4 text-center">
                  <div className="font-bold">{formatDate(date).split(',')[0]}</div>
                  <div className="text-xs">{formatDate(date).split(',')[1]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {getFilteredFields().map((field) => (
              <tr key={field.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 text-left">
                  <div className="font-medium">{field.nama}</div>
                  <div className="text-xs text-gray-500">{field.tipe}</div>
                </td>
                
                {field.schedule.map((day, dayIndex) => (
                  <td key={dayIndex} className="py-3 px-2 text-center">
                    <div className="grid grid-cols-1 gap-1">
                      {day.slots.slice(0, 3).map((slot, slotIndex) => (
                        <div 
                          key={slotIndex} 
                          className={`text-xs py-1 px-2 rounded ${getStatusColor(slot.status)}`}
                        >
                          {slot.jam_mulai.substring(0, 5)} - {slot.jam_selesai.substring(0, 5)}
                          <span className="block font-bold">
                            {slot.status === 'available' ? 'Tersedia' : 'Terisi'}
                          </span>
                        </div>
                      ))}
                      
                      {day.slots.length > 3 && (
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          <Link to={`/field/${field.id}`}>
                            +{day.slots.length - 3} slot lainnya
                          </Link>
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            
            {getFilteredFields().length === 0 && (
              <tr>
                <td colSpan={scheduleData ? scheduleData.dates.length + 1 : 8} className="py-4 text-center text-gray-500">
                  Tidak ada lapangan {activeTab !== 'all' ? activeTab : ''} yang tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 bg-green-100 rounded-full"></span>
            <span className="text-sm text-gray-600">Tersedia</span>
            
            <span className="inline-block w-3 h-3 bg-red-100 rounded-full ml-4"></span>
            <span className="text-sm text-gray-600">Terisi</span>
          </div>
          
          <Link to="/fields" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
            Lihat Semua Lapangan
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ScheduleTable;
