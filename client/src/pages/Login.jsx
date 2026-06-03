import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') {
        navigate('/admin/products');
      } else {
        navigate('/seller/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 text-primary">
                <Activity className="w-10 h-10" />
                <span className="font-bold text-3xl tracking-tight text-foreground">PharmaSync</span>
            </div>
        </div>
        
        <div className="rounded-2xl border bg-card text-card-foreground shadow-2xl border-primary/10 overflow-hidden">
          <div className="flex flex-col space-y-1.5 p-8 pb-6 text-center border-b bg-muted/10">
            <h3 className="text-2xl font-bold tracking-tight">System Access</h3>
            <p className="text-sm text-muted-foreground mt-1">Provide your credentials to access the clinical portal</p>
          </div>
          <div className="p-8 pt-6">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-semibold text-center border border-destructive/20">
                {error}
              </motion.div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-foreground">Staff Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="doctor@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-semibold text-foreground">Password</label>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-4 transition-all disabled:opacity-50 shadow-md hover:shadow-lg mt-2"
              >
                {isLoading ? "Authenticating..." : "Secure Login"}
              </button>
            </form>
          </div>
          <div className="flex items-center justify-center p-6 text-sm text-muted-foreground border-t bg-muted/5">
            New facility registration?{' '}
            <Link to="/register" className="ml-1 text-primary hover:underline font-bold">
              Enroll Here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;