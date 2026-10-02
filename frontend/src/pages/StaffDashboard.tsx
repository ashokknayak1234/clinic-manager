import { useAuth } from '../context/AuthContext';

export default function StaffDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Panel</h1>
          <p className="text-gray-600 mt-1">Welcome, {user?.email} ({user?.role})</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
        <div className="flex items-start">
          <svg className="h-6 w-6 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Under Development</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Staff panel features (appointment management, patient search, prescriptions, billing, reports, audit log, DBMS Explorer)
              will be implemented once backend authentication and workflow APIs are complete.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Appointment Management', desc: 'View, confirm, cancel, reschedule appointments', icon: 'calendar' },
          { title: 'Patient Search', desc: 'Search and manage patient records', icon: 'users' },
          { title: 'Prescriptions', desc: 'Create and manage prescriptions', icon: 'prescription' },
          { title: 'Billing & Invoices', desc: 'Create invoices, record payments', icon: 'billing' },
          { title: 'Reports', desc: 'Appointment counts, revenue summaries', icon: 'reports' },
          { title: 'Audit Log', desc: 'View system audit trail', icon: 'audit' },
          { title: 'DBMS Explorer', desc: 'Database metadata & demo queries', icon: 'database' },
          { title: 'Doctor Management', desc: 'Manage doctors and availability', icon: 'doctor' },
          { title: 'Department Management', desc: 'Manage clinic departments', icon: 'department' },
        ].map((item) => (
          <div key={item.title} className="card hover:shadow-md transition-shadow opacity-50">
            <div className="card-body">
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-500 mt-1 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}