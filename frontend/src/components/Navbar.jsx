import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../assets/css/tq1-landing.css';

function Navbar() {
  const location = useLocation();
  const isAdmin = localStorage.getItem('adminToken');
  const isMember = localStorage.getItem('memberToken');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (isAdmin) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    } else if (isMember) {
      localStorage.removeItem('memberToken');
      localStorage.removeItem('memberUser');
    }
    window.location.href = '/';
  };

  return (
    <nav className={`main-navbar ${isScrolled ? 'scroll' : ''}`}>
      <div className="container">
        <div className="navbar-brand">
          <Link to="/">TQ1 Sports</Link>
        </div>
        
        <div className="navbar-menu">
          <div className="navbar-start">
            <Link 
              to="/" 
              className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              HOME
            </Link>
            <a 
              href="/#about" 
              className="navbar-item"
            >
              ABOUT US
            </a>
            <Link 
              to="/fields" 
              className={`navbar-item ${location.pathname === '/fields' ? 'active' : ''}`}
            >
              FIELDS
            </Link>
            <a 
              href="/#schedule" 
              className="navbar-item"
            >
              SCHEDULES
            </a>
            <Link 
              to="/booking" 
              className={`navbar-item ${location.pathname === '/booking' ? 'active' : ''}`}
            >
              BOOKING
            </Link>
            <a 
              href="/#contact" 
              className="navbar-item"
            >
              CONTACT
            </a>
          </div>
          
          <div className="navbar-end">
            {isAdmin ? (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className="navbar-item btn-primary"
                >
                  ADMIN DASHBOARD
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="navbar-item btn-secondary"
                >
                  LOGOUT
                </button>
              </>
            ) : isMember ? (
              <>
                <Link 
                  to="/member/dashboard" 
                  className="navbar-item btn-primary"
                >
                  MEMBER AREA
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="navbar-item btn-secondary"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/admin" 
                  className="navbar-item btn-primary"
                >
                  LOGIN
                </Link>
                <Link 
                  to="/register" 
                  className="navbar-item btn-secondary"
                >
                  REGISTER
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;