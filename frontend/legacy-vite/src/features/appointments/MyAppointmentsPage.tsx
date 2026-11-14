import { useState, useEffect } from 'react';
import { api } from '../../api/httpClient';
import { useAuth } from '../auth/AuthContext';
import type { Appointment } from '../../shared/apiTypes';

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      try {
        const res = await api.get<{ items: Appointment[] }>(`/appointments?patient_id=${user.user_id}`);
        if (res.success && res.data) {
          setAppointments(res.data.items);
        } else {
          setError(res.error?.message || 'Failed to load appointments');
        }
      } catch {
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return <span className="badge badge-warning">Booked</span>;
      case 'CONFIRMED':
        return <span className="badge badge-success">Confirmed</span>;
      case 'COMPLETED':
        return <span className="badge badge-info">Completed</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      case 'NO_SHOW':
        return <span className="badge badge-gray">No Show</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const isUpcoming = ['BOOKED', 'CONFIRMED'].includes(apt.status);
    return activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
  });

  const handleCancel = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await api.patch(`/appointments/${appointmentId}/cancel`, {});
      if (res.success) {
        setAppointments(prev => prev.map(a => a.appointment_id === appointmentId ? { ...a, status: 'CANCELLED' } : a));
      } else {
        alert(res.error?.message || 'Failed to cancel');
      }
    } catch {
      alert('Failed to cancel appointment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">View and manage your appointments</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-4 -mb-px" aria-label="Appointment tabs">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Upcoming ({appointments.filter(a => ['BOOKED', 'CONFIRMED'].includes(a.status)).length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'past'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Past ({appointments.filter(a => !['BOOKED', 'CONFIRMED'].includes(a.status)).length})
              </button>
            </nav>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-gray-600">
                {activeTab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}
              </p>
              {activeTab === 'upcoming' && (
                <a href="/doctors" className="mt-4 inline-block btn-primary">Book an Appointment</a>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.appointment_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(apt.slot_date || apt.created_at)}</div>
                        <div className="text-sm text-gray-500">{formatTime(apt.start_time || '')} - {formatTime(apt.end_time || '')}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{apt.doctor_name || 'Dr. Unknown'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{apt.department_name || 'General'}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(apt.status)}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{apt.reason || '—'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {['BOOKED', 'CONFIRMED'].includes(apt.status) && (
                            <button
                              onClick={() => handleCancel(apt.appointment_id)}
                              className="text-red-600 hover:text-red-500 font-medium text-sm"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
