import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = user
    ? [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/doctors', label: 'Doctors' },
        { path: '/appointments', label: 'Appointments' },
        { path: '/prescriptions', label: 'Prescriptions' },
        { path: '/invoices', label: 'Invoices' },
        { path: '/profile', label: 'Profile' },
      ]
    : [
        { path: '/', label: 'Home' },
        { path: '/login', label: 'Login' },
        { path: '/register', label: 'Register' },
      ];

  const isStaff = user && ['ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2" aria-label="OpenClinic Home">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xl font-bold text-gray-900">OpenClinic</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isStaff && (
                <Link
                  to="/staff"
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  Staff Panel
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <span className="badge badge-info">{user.role}</span>
                  <button
                    onClick={() => logout()}
                    className="btn-secondary text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="btn-secondary text-sm">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    Register
                  </Link>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div id="mobile-menu" className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      location.pathname === link.path
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {isStaff && (
                  <Link
                    to="/staff"
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Staff Panel
                  </Link>
                )}
                {user && (
                  <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
                    <div className="px-3 py-2">
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <span className="badge badge-info">{user.role}</span>
                    </div>
                    <button
                      onClick={() => logout()}
                      className="btn-danger mx-3"
                    >
                      Logout
                    </button>
                  </div>
                )}
                {!user && (
                  <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2 px-3">
                    <Link to="/login" className="btn-secondary" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            OpenClinic - Educational DBMS Project. Not for real clinical use.
          </p>
        </div>
      </footer>
    </div>
  );
}