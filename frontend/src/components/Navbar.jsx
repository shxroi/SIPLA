import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isAdmin = localStorage.getItem('adminToken');

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                SIPLA
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/fields"
                className={`nav-link ${location.pathname === '/fields' ? 'active' : ''}`}
              >
                Lapangan
              </Link>
              <Link
                to="/booking"
                className={`nav-link ${location.pathname === '/booking' ? 'active' : ''}`}
              >
                Booking
              </Link>
              <Link
                to="/field-management"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Field Management
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="btn-primary mr-2"
                >
                  Dashboard Admin
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                    window.location.href = '/';
                  }}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin"
                className="btn-primary"
              >
                Login Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 