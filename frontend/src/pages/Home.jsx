import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen bg-black">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <p className="text-xl mb-4">new way to book your field!</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            UPGRADE YOUR GAME AT<br />TQ1
          </h1>
          <div className="space-x-4">
            <Link to="/booking" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md">
              GET STARTED
            </Link>
            <Link to="/fields" className="border-2 border-white hover:bg-white hover:text-black px-8 py-3 rounded-md">
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xl mb-4">our weekly field schedules</p>
            <h2 className="text-4xl font-bold">Field Timetable</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 bg-red-600 text-white"></th>
                  <th className="p-4 bg-red-600 text-white">MON</th>
                  <th className="p-4 bg-red-600 text-white">TUE</th>
                  <th className="p-4 bg-red-600 text-white">WED</th>
                  <th className="p-4 bg-red-600 text-white">THU</th>
                  <th className="p-4 bg-red-600 text-white">FRI</th>
                  <th className="p-4 bg-red-600 text-white">SAT</th>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr className="border-b border-gray-700">
                  <td className="p-4 bg-red-600">07:00</td>
                  <td className="p-4">Futsal</td>
                  <td className="p-4">Badminton</td>
                  <td className="p-4">Futsal</td>
                  <td className="p-4">Badminton</td>
                  <td className="p-4">Futsal</td>
                  <td className="p-4">Open</td>
                </tr>
                {/* Add more time slots */}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Fields Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xl text-gray-600 mb-4">Get A Perfect Field</p>
            <h2 className="text-4xl font-bold text-gray-900">Our Available Fields</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src="/images/futsal.jpg" alt="Futsal" className="w-full h-64 object-cover"/>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Futsal Field</h3>
                <p className="text-gray-600 mb-4">Professional futsal field with high-quality artificial grass</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-red-600">Rp 150K/hour</span>
                  <Link to="/booking" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
            {/* Add more fields */}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">New to SIPLA?</h2>
            <p className="text-xl mb-8">Your membership includes:</p>
            <ul className="text-lg mb-8 space-y-4">
              <li>✓ Priority booking for all fields</li>
              <li>✓ Special member prices</li>
              <li>✓ Free equipment rental</li>
              <li>✓ Member-only events</li>
            </ul>
            <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md inline-block">
              BECOME A MEMBER TODAY
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-8">Feel free to ask anything</h2>
              <form className="space-y-6">
                <input type="text" placeholder="Name" className="w-full p-3 border border-gray-300 rounded-md"/>
                <input type="email" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-md"/>
                <textarea placeholder="Message" rows="4" className="w-full p-3 border border-gray-300 rounded-md"></textarea>
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md">
                  Send Message
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-8">Where you can find us</h2>
              <div className="mb-6">
                <p className="text-xl mb-4">Working hours</p>
                <ul className="space-y-2">
                  <li>Monday - Friday: 07:00 AM - 10:00 PM</li>
                  <li>Saturday: 08:00 AM - 08:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
              {/* Add Google Maps integration here */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 