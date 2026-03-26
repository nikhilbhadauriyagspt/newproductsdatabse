import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ChevronLeft, CheckCircle2 } from 'lucide-react';
import API_BASE_URL from '../config';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Identifier, 2: New Password
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!identifier) {
        setError('Please enter your email or phone number');
        return;
      }
      setStep(2);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Failed to update password');
        if (data.message === 'User not found') setStep(1);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
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
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Password assistance</h1>
        <p className="text-[13px] text-gray-600 mb-6">
          {step === 1 
            ? "Enter the email address or mobile phone number associated with your account."
            : "Create a new, strong password that you don't use for other websites."}
        </p>

        {success ? (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 size={32} />
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Password Updated</h2>
            <p className="text-sm text-gray-600 mb-6">Your password has been changed successfully. Redirecting to login...</p>
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Click here to login now</Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-100 rounded text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {step === 1 ? (
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Email or mobile phone number</label>
                <input
                  required
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-400 rounded focus:border-[#FF2D37] focus:ring-1 focus:ring-[#FF2D37] outline-none transition-all text-[15px]"
                />
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">New Password</label>
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
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Password again</label>
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-400 rounded focus:border-[#FF2D37] focus:ring-1 focus:ring-[#FF2D37] outline-none transition-all text-[15px]"
                  />
                </div>
              </>
            )}

            <button
              disabled={loading}
              className="w-full h-10 bg-[#FF2D37] hover:bg-[#e62a32] text-white rounded font-medium shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Continue'}
            </button>
          </form>
        )}
      </div>

      <div className="w-full max-w-[400px] mt-8 text-center">
        <p className="text-sm text-gray-800">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 hover:text-orange-700 hover:underline">Sign in</Link>
        </p>
      </div>

      {/* Footer Links */}
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
