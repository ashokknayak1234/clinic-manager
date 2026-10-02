import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  if (user) {
    return <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>;
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-12">
          <svg className="mx-auto h-24 w-24 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-gray-900">
            Welcome to <span className="text-primary-600">OpenClinic</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            A locally hosted clinic management and patient appointment application built as an educational DBMS project.
            Demonstrates relational database concepts through realistic clinic workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card p-6 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Portal</h3>
            <p className="text-gray-600 text-sm">
              Register, browse doctors, book appointments, view prescriptions and invoices.
            </p>
          </div>

          <div className="card p-6 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 mx-auto mb-4 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Staff Panel</h3>
            <p className="text-gray-600 text-sm">
              Manage appointments, patients, prescriptions, billing, and reports.
            </p>
          </div>

          <div className="card p-6 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Database Demo</h3>
            <p className="text-gray-600 text-sm">
              Explore schema, triggers, procedures, and DBMS concepts in action.
            </p>
          </div>
        </div>

        <div className="bg-primary-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Create your patient account and explore the clinic booking system with fictional demo data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-primary-50 w-full sm:w-auto">
              Create Free Account
            </Link>
            <Link to="/login" className="btn-secondary border-white text-white hover:bg-primary-700 w-full sm:w-auto">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            <strong>Note:</strong> This is an educational prototype using fictional data only.
            Not for real patient care or clinical use.
          </p>
        </div>
      </div>
    </div>
  );
}