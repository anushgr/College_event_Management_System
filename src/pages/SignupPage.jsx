import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
        role,
      });
      // If the backend returns a token on register, log in immediately
      if (response.data?.token) {
        login(response.data.token, response.data.role);
      } else {
        setSuccess('Account created! You can now sign in.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed. The username or email may already be in use.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-50">
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-2xl mb-6 shadow-inner ring-4 ring-indigo-50">
              <UserPlus className="w-10 h-10 text-indigo-700" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
            <p className="mt-3 text-gray-500 font-medium">Join the Event Management Platform</p>
          </div>

          {/* Success */}
          {success && (
            <div className="bg-emerald-50 border-2 border-emerald-100 text-emerald-700 px-5 py-4 rounded-2xl flex items-center space-x-3 mb-6">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-semibold">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all duration-300 font-medium text-gray-700"
                required
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all duration-300 font-medium text-gray-700"
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all duration-300 font-medium text-gray-700"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all duration-300 font-medium text-gray-700"
                required
              />
            </div>

            {/* Role selector */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2 pl-1">Account Type</p>
              <div className="grid grid-cols-2 gap-3">
                {['STUDENT', 'ORGANIZER'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-200 ${
                      role === r
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                        : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-indigo-200 hover:text-indigo-600'
                    }`}
                  >
                    {r === 'STUDENT' ? '🎓 Student' : '🎤 Organizer'}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-rose-50 border-2 border-rose-100 text-rose-700 px-5 py-4 rounded-2xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-200 shadow-xl shadow-indigo-200 flex items-center justify-center space-x-2 disabled:bg-gray-400"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <div className="bg-gray-50 py-5 px-12 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
