import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LogIn, Calendar } from 'lucide-react';

const Navbar = () => {
  const { role, logout, token } = useAuth();

  const linkClass = (active) =>
    `relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
      active
        ? 'text-indigo-600'
        : 'text-gray-600 hover:text-indigo-600'
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* 🔹 Logo Section */}
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md group-hover:scale-105 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EventManager
              </span>
            </Link>

            {/* 🔹 Nav Links */}
            <div className="hidden md:flex md:ml-10 md:space-x-6">
              <NavLink to="/dashboard">
                {({ isActive }) => (
                  <span className={linkClass(isActive)}>
                    Dashboard
                    {isActive && (
                      <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-indigo-600 rounded-full"></span>
                    )}
                  </span>
                )}
              </NavLink>

              {role === 'ORGANIZER' && (
                <NavLink to="/add-event">
                  {({ isActive }) => (
                    <span className={linkClass(isActive)}>
                      Add Event
                      {isActive && (
                        <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-indigo-600 rounded-full"></span>
                      )}
                    </span>
                  )}
                </NavLink>
              )}
            </div>
          </div>

          {/* 🔹 Right Section */}
          <div className="flex items-center space-x-4">

            {token ? (
              <>
                {/* Role Info */}
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">
                    Logged in as
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {role}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl 
                  bg-gradient-to-r from-rose-500 to-red-500 text-white 
                  shadow-md hover:shadow-lg hover:scale-105 
                  transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-5 py-2 rounded-xl 
                bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
                shadow-md hover:shadow-lg hover:scale-105 
                transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-semibold">Login</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;