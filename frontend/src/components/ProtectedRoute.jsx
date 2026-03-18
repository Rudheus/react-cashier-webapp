import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  //jkalau tidak ada token, Redirect ke login
  if (!token) {
    return <Navigate to="/login" />;
  }

  //jika ada token tapi role tidak sesuai, Redirect ke halaman merekka
  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'owner') return <Navigate to="/owner" />;
    if (user.role === 'manager') return <Navigate to="/manager" />;
    if (user.role === 'cashier') return <Navigate to="/cashier" />;
  };

  return children;
}