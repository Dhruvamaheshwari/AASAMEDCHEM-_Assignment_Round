import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    // Very basic role check (in a real app, rely on backend and robust decoding)
    if (requiredRole && user.role !== requiredRole) {
        return <div>Unauthorized: Requires {requiredRole} role</div>;
    }

    return children;
};

export default ProtectedRoute;