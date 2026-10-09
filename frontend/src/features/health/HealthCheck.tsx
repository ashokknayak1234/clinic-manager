import { useState, useEffect } from 'react';
import { api } from '../../api/httpClient';

export default function HealthCheck() {
  const [apiHealth, setApiHealth] = useState<{ status: string } | null>(null);
  const [dbHealth, setDbHealth] = useState<{ status: string; version: string; database_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const [apiRes, dbRes] = await Promise.all([
          api.health(),
          api.healthDatabase(),
        ]);

        if (apiRes.success && apiRes.data) {
          setApiHealth(apiRes.data);
        }
        if (dbRes.success && dbRes.data) {
          setDbHealth(dbRes.data);
        } else {
          setError(dbRes.error?.message || 'Database health check failed');
        }
      } catch (err) {
        setError('Failed to connect to backend');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'connected' || status === 'ok') return 'text-green-600 bg-green-100';
    if (status === 'error' || status === 'unavailable') return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
        <p className="text-gray-600 mt-1">Monitor API and database connectivity</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              API Status
            </h2>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
              </div>
            ) : apiHealth ? (
              <div className="text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getStatusColor(apiHealth.status)}`}>
                  {apiHealth.status.toUpperCase()}
                </div>
                <p className="mt-4 text-sm text-gray-500">Backend API is responding normally</p>
              </div>
            ) : (
              <div className="text-center text-red-600">API check failed</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              Database Status
            </h2>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
              </div>
            ) : dbHealth ? (
              <div>
                <div className="mb-4">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getStatusColor(dbHealth.status)}`}>
                    {dbHealth.status.toUpperCase()}
                  </div>
                </div>
                {dbHealth.version && (
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">MySQL Version</dt>
                      <dd className="font-mono text-gray-900">{dbHealth.version}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Database</dt>
                      <dd className="font-mono text-gray-900">{dbHealth.database_name}</dd>
                    </div>
                  </dl>
                )}
              </div>
            ) : (
              <div className="text-center text-red-600">
                {error || 'Database check failed'}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="card border-red-200">
          <div className="card-body">
            <div className="flex items-center gap-3 text-red-700">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Test Credentials (Demo)</h2>
        </div>
        <div className="card-body">
          <p className="text-sm text-gray-600 mb-4">Use these accounts to test the application:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Patient</p>
              <p className="text-sm text-gray-500 font-mono">patient@demo.com / patient123</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Doctor</p>
              <p className="text-sm text-gray-500 font-mono">doctor@demo.com / doctor123</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Admin</p>
              <p className="text-sm text-gray-500 font-mono">admin@demo.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
