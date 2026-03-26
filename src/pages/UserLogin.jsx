import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import API_BASE_URL from '../config';

export default function UserLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load remembered user
  useEffect(() => {
    const savedUser = localStorage.getItem('remembered_user');
    if (savedUser) {
      setIdentifier(savedUser);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'user', identifier, password })
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('remembered_user', identifier);
        } else {
          localStorage.removeItem('remembered_user');
        }

        localStorage.setItem('user', JSON.stringify(data.data));
        window.dispatchEvent(new Event('storage'));
        navigate('/');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#f8f9fa] flex flex-col items-center pt-8 md:pt-12 font-['Inter',sans-serif]">
      {/* Brand Logo */}
      <Link to="/" className="mb-8">
        <img src="/logo/logo.png" alt="Logo" className="h-10 md:h-12 object-contain" />
      </Link>

      <div className="w-full max-w-[400px] bg-white md:border md:border-gray-200 md:rounded-lg p-6 md:p-8 md:shadow-sm">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-100 rounded text-red-600 text-sm flex items-center gap-2"
              >
                <div className="w-1 h-1 bg-red-600 rounded-full" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700 ml-0.5">Email or Mobile phone number</label>
            <input
              required
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full h-10 px-3 border border-gray-400 rounded focus:border-[#FF2D37] focus:ring-1 focus:ring-[#FF2D37] outline-none transition-all text-[15px]"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700 ml-0.5">Password</label>
              <Link to="/forgot-password" size={14} className="text-xs text-blue-600 hover:text-orange-700 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 pr-10 border border-gray-400 rounded focus:border-[#FF2D37] focus:ring-1 focus:ring-[#FF2D37] outline-none transition-all text-[15px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 py-1">
            <label className="flex items-center cursor-pointer group select-none">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <div className="w-4 h-4 bg-white border border-gray-400 rounded peer-checked:bg-[#FF2D37] peer-checked:border-[#FF2D37] transition-all flex items-center justify-center">
                <CheckCircle2 size={10} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="ml-2 text-[13px] text-gray-700 group-hover:text-gray-900 transition-colors">Keep me signed in</span>
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full h-10 bg-[#FF2D37] hover:bg-[#e62a32] text-white rounded font-medium shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Continue'}
          </button>

          <p className="text-[12px] text-gray-600 leading-normal pt-2">
            By continuing, you agree to our <Link to="/terms" className="text-blue-600 hover:underline">Terms of Use</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </div>

      <div className="w-full max-w-[400px] mt-8 flex flex-col items-center">
        <div className="w-full flex items-center gap-3 mb-4">
          <div className="flex-1 h-[1px] bg-gray-200" />
          <span className="text-xs text-gray-500 whitespace-nowrap">New to our shop?</span>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>
        
        <Link 
          to="/signup" 
          className="w-full h-10 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-700 transition-colors"
        >
          Create your account
        </Link>
      </div>

      {/* Footer Links */}
      <div className="mt-auto py-8 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-gray-200 w-full bg-gray-50 md:bg-transparent">
        <Link to="/terms" className="text-[11px] text-blue-600 hover:underline">Conditions of Use</Link>
        <Link to="/privacy" className="text-[11px] text-blue-600 hover:underline">Privacy Notice</Link>
        <Link to="/help" className="text-[11px] text-blue-600 hover:underline">Help</Link>
        <p className="text-[11px] text-gray-500 w-full text-center mt-2">© 2024-2026, Dash Printer Shop or its affiliates</p>
      </div>
    </div>
  );
}
