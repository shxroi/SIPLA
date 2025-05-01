import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  
  if (!adminUser || !adminUser.id) {
    // Redirect ke halaman login jika tidak ada user
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;