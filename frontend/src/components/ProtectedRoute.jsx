import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    // Redirect ke halaman login jika tidak ada token
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute; 