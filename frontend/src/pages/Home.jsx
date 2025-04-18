import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Selamat Datang di SIPLA
        </h1>
        <p className="text-xl text-gray-600">
          Sistem Informasi Pemesanan Lapangan Olahraga
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lapangan Futsal</h2>
          <p className="text-gray-600 mb-4">
            Booking lapangan futsal dengan mudah dan cepat.
          </p>
          <Link
            to="/booking"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Booking Sekarang
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Lapangan Bulutangkis</h2>
          <p className="text-gray-600 mb-4">
            Tersedia sistem membership untuk pemain reguler.
          </p>
          <Link
            to="/booking"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Booking Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home; 