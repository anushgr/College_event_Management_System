import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LogIn, Calendar } from 'lucide-react';

const Navbar = () => {
  const { role, logout, token } = useAuth();

  const linkClass = (active) =>
    `px-4 py-2 rounded-lg transition-colors duration-200 ${
      active
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className="flex items-center space-x-2 text-indigo-700 font-bold text-xl drop-shadow-sm">
              <Calendar className="w-8 h-8" />
              <span>EventManager</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              <NavLink
                to="/dashboard"
                className={({ isActive: active }) => linkClass(active)}
              >
                Dashboard
              </NavLink>
              {role === 'ORGANIZER' && (
                <NavLink
                  to="/add-event"
                  className={({ isActive: active }) => linkClass(active)}
                >
                  Add Event
                </NavLink>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <div className="hidden sm:block mr-2">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Logged in as</span>
                  <p className="text-sm font-medium text-gray-700">{role}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-lg hover:bg-rose-600 hover:text-white transition-all duration-300 font-medium border border-rose-100"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-semibold shadow-md shadow-indigo-200"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
