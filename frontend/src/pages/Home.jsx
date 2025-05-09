import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import '../assets/css/tq1-landing.css';
import '../assets/js/tq1-scripts.js';
import Navbar from '../components/Navbar';

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarCollapseRef = useRef(null);
  const navbarTogglerRef = useRef(null);

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

  const toggleNavbar = () => {
    if (navbarCollapseRef.current) {
      navbarCollapseRef.current.classList.toggle('show');
      
      if (navbarTogglerRef.current) {
        const expanded = navbarTogglerRef.current.getAttribute('aria-expanded') === 'true' || false;
        navbarTogglerRef.current.setAttribute('aria-expanded', !expanded);
      }
    }
  };

  const closeNavbar = () => {
    if (navbarCollapseRef.current && navbarCollapseRef.current.classList.contains('show')) {
      navbarCollapseRef.current.classList.remove('show');
      
      if (navbarTogglerRef.current) {
        navbarTogglerRef.current.setAttribute('aria-expanded', 'false');
      }
    }
  };

  return (
    <div>
      {/* Navbar */}
      

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-text">
          <h6>new way to book your field!</h6>
          <h1>UPGRADE YOUR GAME AT TQ1</h1>
          <div className="mt-4">
            <Link to="/booking" className="custom-btn bg-color mr-3">GET STARTED</Link>
            <Link to="/fields" className="custom-btn bordered">LEARN MORE</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about section" id="about">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-10 mx-auto col-12">
              <div className="section-title-wrap mb-5">
                <h2 className="section-title">Best Place to Play Sports</h2>
                <p className="section-sub-title">TQ1 Sports provides premium sports facilities for all your needs</p>
              </div>

              <p>TQ1 Sports Field Booking System offers a seamless experience for booking high-quality sports fields. Whether you're looking for futsal, badminton, or basketball courts, we've got you covered with our state-of-the-art facilities.</p>

              <p>Our mission is to promote an active lifestyle by providing accessible and well-maintained sports facilities for everyone. Join our community today and experience the difference!</p>
            </div>

            <div className="col-lg-4 col-md-10 mx-auto mt-4 mt-lg-0">
              <div className="about-working-hours">
                <h4 className="mb-4">Working hours</h4>

                <div className="working-hours d-flex">
                  <p>Monday - Friday</p>
                  <p className="ml-auto">7:00 AM - 10:00 PM</p>
                </div>

                <div className="working-hours d-flex">
                  <p>Saturday</p>
                  <p className="ml-auto">8:00 AM - 8:00 PM</p>
                </div>

                <div className="working-hours d-flex">
                  <p>Sunday</p>
                  <p className="ml-auto">Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fields Section */}
      <section className="section" id="fields">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center mb-5">
              <h2 className="section-title">Our Available Fields</h2>
            </div>

            <div className="col-lg-4 col-md-6 col-12">
              <div className="field-thumb">
                <img src="/images/lapangan1.jpg" className="img-fluid" alt="Futsal Field" />
                <div className="field-info">
                  <h3 className="mb-1">Futsal Field A</h3>
                  <span className="field-price mb-3">Rp 150K/hour</span>
                  <p>Professional futsal field with high-quality artificial grass</p>
                  <Link to="/booking" className="custom-btn bg-color mt-3">Book Now</Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-12">
              <div className="field-thumb">
                <img src="/images/lapangan2.jpg" className="img-fluid" alt="Futsal Field" />
                <div className="field-info">
                  <h3 className="mb-1">Futsal Field B</h3>
                  <span className="field-price mb-3">Rp 150K/hour</span>
                  <p>Professional futsal field with high-quality artificial grass</p>
                  <Link to="/booking" className="custom-btn bg-color mt-3">Book Now</Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-12">
              <div className="field-thumb">
                <img src="/images/bultang1.jpeg" className="img-fluid" alt="Badminton Court" />
                <div className="field-info">
                  <h3 className="mb-1">Badminton Court</h3>
                  <span className="field-price mb-3">Rp 100K/hour</span>
                  <p>Indoor badminton court with professional flooring</p>
                  <Link to="/booking" className="custom-btn bg-color mt-3">Book Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="schedule section" id="schedule">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center mb-5">
              <h2 className="section-title">Field Timetable</h2>
            </div>

            <div className="col-lg-12 col-12">
              <table className="schedule-table table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th><small>Time</small></th>
                    <th><small>Monday</small></th>
                    <th><small>Tuesday</small></th>
                    <th><small>Wednesday</small></th>
                    <th><small>Thursday</small></th>
                    <th><small>Friday</small></th>
                    <th><small>Saturday</small></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><small>07:00</small></td>
                    <td>
                      <strong>Futsal</strong>
                      <span>7:00 - 8:00</span>
                    </td>
                    <td>
                      <strong>Badminton</strong>
                      <span>7:00 - 8:00</span>
                    </td>
                    <td>
                      <strong>Futsal</strong>
                      <span>7:00 - 8:00</span>
                    </td>
                    <td>
                      <strong>Badminton</strong>
                      <span>7:00 - 8:00</span>
                    </td>
                    <td>
                      <strong>Futsal</strong>
                      <span>7:00 - 8:00</span>
                    </td>
                    <td>
                      <strong>Open</strong>
                      <span>7:00 - 8:00</span>
                    </td>
                  </tr>

                  <tr>
                    <td><small>09:00</small></td>
                    <td>
                      <strong>Basketball</strong>
                      <span>9:00 - 10:00</span>
                    </td>
                    <td>
                      <strong>Futsal</strong>
                      <span>9:00 - 10:00</span>
                    </td>
                    <td>
                      <strong>Basketball</strong>
                      <span>9:00 - 10:00</span>
                    </td>
                    <td>
                      <strong>Futsal</strong>
                      <span>9:00 - 10:00</span>
                    </td>
                    <td>
                      <strong>Basketball</strong>
                      <span>9:00 - 10:00</span>
                    </td>
                    <td>
                      <strong>Open</strong>
                      <span>9:00 - 10:00</span>
                    </td>
                  </tr>

                  <tr>
                    <td><small>13:00</small></td>
                    <td>
                      <strong>Badminton</strong>
                      <span>13:00 - 14:00</span>
                    </td>
                    <td>
                      <strong>Basketball</strong>
                      <span>13:00 - 14:00</span>
                    </td>
                    <td>
                      <strong>Badminton</strong>
                      <span>13:00 - 14:00</span>
                    </td>
                    <td>
                      <strong>Basketball</strong>
                      <span>13:00 - 14:00</span>
                    </td>
                    <td>
                      <strong>Badminton</strong>
                      <span>13:00 - 14:00</span>
                    </td>
                    <td>
                      <strong>Open</strong>
                      <span>13:00 - 14:00</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="feature section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-10 mx-auto col-12 text-center">
              <h2 className="mb-4">New to SIPLA?</h2>
              <p className="mb-5">Your membership includes:</p>
              <ul className="list-unstyled mb-5">
                <li className="mb-3">✓ Priority booking for all fields</li>
                <li className="mb-3">✓ Special member prices</li>
                <li className="mb-3">✓ Free equipment rental</li>
                <li className="mb-3">✓ Member-only events</li>
              </ul>
              <Link to="/register" className="custom-btn bg-color">BECOME A MEMBER TODAY</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact section" id="contact">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <h2 className="mb-4">Feel free to ask anything</h2>

              <form className="contact-form webform">
                <input type="text" className="form-control" name="name" placeholder="Name" />
                <input type="email" className="form-control" name="email" placeholder="Email" />
                <textarea className="form-control" rows="5" name="message" placeholder="Message"></textarea>
                <button type="submit" className="form-control" id="submit-button">Send Message</button>
              </form>
            </div>

            <div className="col-lg-6 col-md-6 col-12">
              <h2 className="mb-4">Where you can find us</h2>

              <p className="mb-1">Address: Jl. Olahraga No. 123, Jakarta Selatan</p>
              <p className="mb-1">Phone: +62 21 1234 5678</p>
              <p className="mb-1">Email: info@tq1sports.com</p>

              <div className="google-map pt-5">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMzAuOCJTIDEwNsKwNDgnMzEuMiJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                  title="TQ1 Location">
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-12 text-center">
              <p className="mb-0"> 2025 TQ1 Sports Field Booking System</p>
              <ul className="social-icon">
                <li><a href="#" className="fa fa-facebook"></a></li>
                <li><a href="#" className="fa fa-twitter"></a></li>
                <li><a href="#" className="fa fa-instagram"></a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;