import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Selamat Datang di SIPLA
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistem Informasi Pemesanan Lapangan Olahraga
        </p>
        <Link to="/booking" className="btn-primary text-lg">
          Mulai Booking Sekarang
        </Link>
      </div>

      {/* Alur Pemesanan */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Cara Pemesanan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Pilih Lapangan</h3>
            <p className="text-gray-600">
              Pilih jenis lapangan yang ingin Anda gunakan (Futsal/Bulutangkis)
            </p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Pilih Jadwal</h3>
            <p className="text-gray-600">
              Tentukan tanggal dan waktu yang Anda inginkan
            </p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Isi Data</h3>
            <p className="text-gray-600">
              Lengkapi data diri Anda untuk pemesanan
            </p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="text-xl font-semibold mb-2">Selesai</h3>
            <p className="text-gray-600">
              Dapatkan konfirmasi pemesanan Anda
            </p>
          </div>
        </div>
      </div>

      {/* Jenis Lapangan */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Pilihan Lapangan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Lapangan Futsal</h3>
            <p className="text-gray-600 mb-4">
              Lapangan futsal dengan fasilitas lengkap dan nyaman untuk bermain
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-600">
              <li>Rumput sintetis berkualitas</li>
              <li>Ukuran standar internasional</li>
              <li>Tersedia pada jam 08.00 - 22.00</li>
            </ul>
            <Link to="/booking" className="btn-primary inline-block">
              Booking Sekarang
            </Link>
          </div>
          <div className="card">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Lapangan Bulutangkis</h3>
            <p className="text-gray-600 mb-4">
              Lapangan bulutangkis indoor dengan sistem membership
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-600">
              <li>Lantai standar turnamen</li>
              <li>Pencahayaan optimal</li>
              <li>Tersedia sistem membership</li>
            </ul>
            <Link to="/booking" className="btn-primary inline-block">
              Booking Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 