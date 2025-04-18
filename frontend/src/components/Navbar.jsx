import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            SIPLA
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <Link to="/fields" className="text-gray-600 hover:text-gray-800">
              Lapangan
            </Link>
            <Link to="/booking" className="text-gray-600 hover:text-gray-800">
              Booking
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-gray-800">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 