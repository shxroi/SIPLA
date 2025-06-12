import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/tq1-landing.css';

function MemberRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_telepon: '',
    password: '',
    confirm_password: '',
    lapangan_id: bookingData?.fieldId || '',
    tanggal_mulai: today.toISOString().split('T')[0],
    tanggal_berakhir: nextMonth.toISOString().split('T')[0],
    jam_sewa: '19:00',
    status: 'aktif',
    jenis_membership: 'bulanan',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [badmintonFields, setBadmintonFields] = useState([]);
  const [timeSlots, setTimeSlots] = useState([
    '08:00',
    '10:00',
    '13:00',
    '15:00',
    '17:00',
    '19:00',
  ]);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const fetchBadmintonFields = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/lapangan/public');
        const fields = response.data.filter((field) => field.tipe === 'bulutangkis');
        setBadmintonFields(fields);
        if (!formData.lapangan_id && fields.length > 0) {
          setFormData((prev) => ({
            ...prev,
            lapangan_id: fields[0].id,
          }));
        }
      } catch (error) {
        console.error('Error fetching badminton fields:', error);
      }
    };
    fetchBadmintonFields();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      if (!formData.nama || !formData.email || !formData.password || !formData.confirm_password) {
        setError('Mohon lengkapi semua field yang wajib diisi');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Masukkan alamat email yang valid');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password minimal 6 karakter');
        return;
      }

      if (formData.password !== formData.confirm_password) {
        setError('Password dan konfirmasi password tidak sama');
        return;
      }

      if (formData.no_telepon) {
        const phoneRegex = /^[0-9]{10,13}$/;
        const phoneNumber = formData.no_telepon.startsWith('0')
          ? formData.no_telepon.slice(1)
          : formData.no_telepon;
        if (!phoneRegex.test(phoneNumber)) {
          setError('Format nomor telepon tidak valid');
          return;
        }
      }

      setError(null);
      setActiveStep(2);
    }
  };

  const handlePrevStep = () => {
    setActiveStep(1);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (
        !formData.nama ||
        !formData.email ||
        !formData.password ||
        !formData.lapangan_id ||
        !formData.tanggal_mulai ||
        !formData.tanggal_berakhir ||
        !formData.jam_sewa
      ) {
        throw new Error('Mohon lengkapi semua field yang wajib diisi');
      }

      if (formData.password !== formData.confirm_password) {
        throw new Error('Password dan konfirmasi password tidak sama');
      }

      const phoneNumber = formData.no_telepon
        ? formData.no_telepon.startsWith('0')
          ? formData.no_telepon.slice(1)
          : formData.no_telepon
        : null;

      const response = await axios.post('http://localhost:3000/api/member/register', {
        nama: formData.nama,
        email: formData.email,
        no_telepon: phoneNumber,
        password: formData.password,
        lapangan_id: parseInt(formData.lapangan_id),
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_berakhir: formData.tanggal_berakhir,
        jam_sewa: `${formData.jam_sewa}:00`,
        status: 'aktif',
        jenis_membership: 'bulanan',
      });

      localStorage.setItem('memberToken', response.data.token);
      localStorage.setItem('memberUser', JSON.stringify(response.data.member));

      navigate(bookingData ? '/member/booking' : '/member/dashboard', { state: bookingData });
    } catch (error) {
      console.error('Error registering member:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat registrasi');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotSelect = (time) => {
    setFormData((prev) => ({
      ...prev,
      jam_sewa: time,
    }));
    if (error?.includes('jam')) {
      setError(null);
    }
  };

  return (
    <div className="register-container py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-4">Membership TQ1</h1>
                <p className="text-sm opacity-80 mb-8 text-white">
                  Buat akun Anda di TQ1 dan nikmati akses langsung ke lapangan bulutangkis premium kami.
                </p>
              </div>
              <div className="text-center">
                <img
                  src="/src/assets/images/badminton.png"
                  alt="Badminton"
                  className="w-48 h-48 mx-auto mb-10"
                />
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-blue-600 py-3 px-6 rounded-full w-full transition duration-300">
                  MULAI SEKARANG
                </button>
              </div>
              <div className="mt-8 text-xs text-center opacity-70">
                <p className="text-white">© 2025 TQ1 Sports Field. All rights reserved.</p>
              </div>
            </div>
            <div className="md:w-3/5 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Register</h2>
                <p className="text-sm text-gray-500">Buat akun Anda di TQ1 dan nikmati akses langsung</p>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeStep === 1 ? (
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="nama"
                      >
                        Nama Lengkap *
                      </label>
                      <input
                        id="nama"
                        name="nama"
                        type="text"
                        value={formData.nama}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="email"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan email Anda"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="no_telepon"
                      >
                        Nomor Telepon
                      </label>
                      <div className="flex">
                        <div className="bg-gray-100 border border-gray-300 border-r-0 rounded-l-md px-3 py-2 text-gray-500">
                          +62
                        </div>
                        <input
                          id="no_telepon"
                          name="no_telepon"
                          type="tel"
                          value={formData.no_telepon}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="8123456789"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="password"
                      >
                        Password *
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan password"
                        required
                        minLength="6"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="confirm_password"
                      >
                        Konfirmasi Password *
                      </label>
                      <input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Konfirmasi password"
                        required
                        minLength="6"
                      />
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center">
                        <input
                          id="terms"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          required
                        />
                        <label
                          htmlFor="terms"
                          className="ml-2 block text-sm text-gray-600"
                        >
                          Saya menyetujui{' '}
                          <a href="#" className="text-blue-600 hover:underline">
                            Syarat dan Ketentuan
                          </a>
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                    >
                      Lanjutkan
                    </button>
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        Sudah memiliki akun?{' '}
                        <Link
                          to="/member/login"
                          className="text-blue-600 hover:underline"
                        >
                          Login di sini
                        </Link>
                      </p>
                    </div>
                    <div className="mt-6 flex justify-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="lapangan_id"
                      >
                        Pilih Lapangan Bulutangkis *
                      </label>
                      <select
                        id="lapangan_id"
                        name="lapangan_id"
                        value={formData.lapangan_id}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Pilih Lapangan</option>
                        {badmintonFields.map((field) => (
                          <option key={field.id} value={field.id}>
                            {field.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Periode Membership
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-gray-600 text-xs mb-1"
                            htmlFor="tanggal_mulai"
                          >
                            Tanggal Mulai *
                          </label>
                          <input
                            id="tanggal_mulai"
                            name="tanggal_mulai"
                            type="date"
                            value={formData.tanggal_mulai}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label
                            className="block text-gray-600 text-xs mb-1"
                            htmlFor="tanggal_berakhir"
                          >
                            Tanggal Berakhir *
                          </label>
                          <input
                            id="tanggal_berakhir"
                            name="tanggal_berakhir"
                            type="date"
                            value={formData.tanggal_berakhir}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Pilih Jam Bermain Reguler *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {timeSlots.map((time, index) => (
                          <div
                            key={index}
                            onClick={() => handleTimeSlotSelect(time)}
                            className={`p-3 rounded-md border cursor-pointer text-center ${
                              formData.jam_sewa === time
                                ? 'bg-blue-50 border-blue-500'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <span className="block text-sm">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300"
                      >
                        Kembali
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-1/2 font-medium py-2 px-4 rounded-md transition duration-300 ${
                          loading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {loading ? 'Memproses...' : 'Daftar Sekarang'}
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberRegister;