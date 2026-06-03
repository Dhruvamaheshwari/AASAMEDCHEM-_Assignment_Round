import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, ClipboardList, Archive, LayoutDashboard, 
  FileText, LogOut, Menu, X, ChevronRight, Activity 
} from 'lucide-react';

export default function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Generate breadcrumb from path
  const currentPathName = links.find(l => l.path === location.pathname)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card shadow-sm z-10 sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to={user?.role === 'ADMIN' ? '/admin/products' : '/seller/dashboard'} className="flex items-center space-x-2 text-primary">
            <Activity className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight">PharmaSync</span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Main Navigation
          </div>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t mt-auto">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-muted/50 border">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
            </div>
            <button 
              onClick={handleLogout} 
              title="Logout"
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-card border-r shadow-xl z-50 flex flex-col lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b">
                <span className="font-bold text-xl text-primary flex items-center gap-2">
                  <Activity className="w-5 h-5" /> PharmaSync
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 py-6 px-4 space-y-1">
                {links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
              <div className="p-4 border-t">
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-card/80 backdrop-blur-md px-4 sm:px-8 shadow-sm">
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="lg:hidden p-2 text-muted-foreground hover:bg-muted rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">PharmaSync Dashboard</span>
            <ChevronRight className="w-4 h-4 hidden sm:inline" />
            <span className="font-medium text-foreground">{currentPathName}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
