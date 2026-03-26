import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import API_BASE_URL from '../config';

export default function UserSignup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Backend expects: name, email, password, phone
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          origin_website: window.location.origin 
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Account created successfully! Please login.');
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Signup API Error:', err);
      setError('Connection error. Please ensure your backend server is running on ' + API_BASE_URL);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#f8f9fa] flex flex-col items-center pt-8 md:pt-12 font-['Inter',sans-serif]">
      <Link to="/" className="mb-8">
        <img src="/logo/logo.png" alt="Logo" className="h-10 md:h-12 object-contain" />
      </Link>

      <div className="w-full max-w-[400px] bg-white md:border md:border-gray-200 md:rounded-lg p-6 md:p-8 md:shadow-sm">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Create Account</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="p-3 bg-red-50 border border-red-100 rounded text-red-600 text-[13px] leading-tight"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Your name</label>
            <input
              required
              type="text"
              placeholder="First and last name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-10 px-3 border border-gray-400 rounded focus:border-[#FF2D37] focus:ring-1 focus:ring-[#FF2D37] outline-none text-[14px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Mobile number</label>
            <input
              required
              type="tel"
              placeholder="Mobile number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full h-10 px-3 border border-gray-400 rounded focus:border-[#FF2D37] focus:ring-1 focus:ring-[#FF2D37] outline-none text-[14px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Email address</label>
            <input
              required
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-10 px-3 border border-gray-400 rounded focus:border-[#FF2D37] focus:ring-1 focus:ring-[#FF2D37] outline-none text-[14px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">Password</label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full h-10 px-3 pr-10 border border-gray-400 rounded focus:border-[#FF2D37] focus:ring-1 focus:ring-[#FF2D37] outline-none text-[14px]"
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

          <button
            disabled={loading}
            className="w-full h-10 bg-[#FF2D37] hover:bg-[#e62a32] text-white rounded font-medium shadow-sm transition-colors flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create your account'}
          </button>

          <div className="w-full h-[1px] bg-gray-200 my-6" />

          <div className="text-sm text-gray-800">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-orange-700 hover:underline">Sign in</Link>
          </div>
        </form>
      </div>

      <div className="mt-auto py-8 text-[11px] text-gray-500 text-center w-full">
        <div className="flex justify-center gap-6 mb-2">
          <Link to="/terms" className="text-blue-600 hover:underline">Conditions of Use</Link>
          <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Notice</Link>
          <Link to="/help" className="text-blue-600 hover:underline">Help</Link>
        </div>
        © 2024-2026, Dash Printer Shop or its affiliates
      </div>
    </div>
  );
}
