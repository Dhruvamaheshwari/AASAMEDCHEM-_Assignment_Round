import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminInventory from './pages/admin/Inventory';
import SellerDashboard from './pages/seller/Dashboard';
import NewQuotation from './pages/seller/NewQuotation';
import MyQuotations from './pages/seller/MyQuotations';
import MainLayout from './components/layout/MainLayout';
import './index.css';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />; // or to a forbidden page
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<MainLayout />}>
        {/* Admin Routes */}
        <Route path="/admin/products" element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminProducts />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminOrders />
          </ProtectedRoute>
        } />
        <Route path="/admin/inventory" element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminInventory />
          </ProtectedRoute>
        } />

        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={
          <ProtectedRoute roles={['SELLER', 'ADMIN']}>
            <SellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/seller/new-quotation" element={
          <ProtectedRoute roles={['SELLER', 'ADMIN']}>
            <NewQuotation />
          </ProtectedRoute>
        } />
        <Route path="/seller/my-quotations" element={
          <ProtectedRoute roles={['SELLER', 'ADMIN']}>
            <MyQuotations />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
