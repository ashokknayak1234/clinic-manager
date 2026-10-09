import { useAuth } from '../auth/AuthContext';

export default function MyPrescriptionsPage() {
  useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
        <p className="text-gray-600 mt-1">View your prescription history</p>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No prescriptions yet</h3>
          <p className="mt-1 text-gray-500">Prescriptions from completed appointments will appear here.</p>
        </div>
      </div>
    </div>
  );
}
