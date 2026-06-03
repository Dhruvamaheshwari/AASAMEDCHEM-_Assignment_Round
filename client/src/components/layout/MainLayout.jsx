import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Package, ClipboardList, Archive, LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';

export default function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { name: 'Inventory', path: '/admin/inventory', icon: Archive },
  ];

  const sellerLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
    { name: 'New Quotation', path: '/seller/new-quotation', icon: FileText },
    { name: 'My Quotations', path: '/seller/my-quotations', icon: ClipboardList },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : sellerLinks;

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8 mx-auto">
          <div className="flex items-center gap-6">
            <Link to={user?.role === 'ADMIN' ? '/admin/products' : '/seller/dashboard'} className="flex items-center space-x-2">
              <span className="font-bold text-xl hidden sm:inline-block">AcmeCorp</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`transition-colors hover:text-foreground/80 flex items-center gap-2 ${isActive ? 'text-foreground' : 'text-foreground/60'}`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                {user?.name} ({user?.role})
              </span>
              <button 
                onClick={handleLogout} 
                title="Logout"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10 text-muted-foreground"
              >
                <LogOut className="h-5 w-5 hover:text-foreground transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-screen-2xl p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
