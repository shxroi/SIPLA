import { Link } from 'react-router-dom';

function FieldList() {
  const fields = [
    {
      id: 1,
      name: 'Lapangan Futsal A',
      type: 'futsal',
      description: 'Lapangan futsal dengan rumput sintetis berkualitas tinggi',
      price: 150000,
      image: 'https://via.placeholder.com/400x300'
    },
    {
      id: 2,
      name: 'Lapangan Futsal B',
      type: 'futsal',
      description: 'Lapangan futsal indoor dengan fasilitas lengkap',
      price: 175000,
      image: 'https://via.placeholder.com/400x300'
    },
    {
      id: 3,
      name: 'Lapangan Bulutangkis 1',
      type: 'badminton',
      description: 'Lapangan bulutangkis standar internasional',
      price: 75000,
      image: 'https://via.placeholder.com/400x300'
    },
    {
      id: 4,
      name: 'Lapangan Bulutangkis 2',
      type: 'badminton',
      description: 'Lapangan bulutangkis dengan pencahayaan optimal',
      price: 75000,
      image: 'https://via.placeholder.com/400x300'
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Daftar Lapangan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <div key={field.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={field.image}
              alt={field.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {field.name}
              </h2>
              <p className="text-gray-600 mb-4">{field.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">
                  Rp {field.price.toLocaleString('id-ID')}/jam
                </span>
                <Link
                  to="/booking"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Booking
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FieldList; 