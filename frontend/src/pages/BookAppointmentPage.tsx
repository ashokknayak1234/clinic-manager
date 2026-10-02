import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Doctor, TimeSlot } from '../types';
import { useAuth } from '../context/AuthContext';

export default function BookAppointmentPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      try {
        const res = await api.get<Doctor>(`/doctors/${doctorId}`);
        if (res.success && res.data) {
          setDoctor(res.data);
        }
      } catch {
        setError('Failed to load doctor');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (!doctorId || !selectedDate) return;
    const fetchSlots = async () => {
      try {
        const res = await api.get<{ items: TimeSlot[] }>(`/doctors/${doctorId}/slots?date=${selectedDate}`);
        if (res.success && res.data) {
          setSlots(res.data.items.filter(s => s.is_available));
        }
      } catch {
        setSlots([]);
      }
    };
    fetchSlots();
  }, [doctorId, selectedDate]);

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleBook = async () => {
    if (!selectedSlot || !user) return;
    setError('');
    setBooking(true);
    try {
      const res = await api.post<{ appointment_id: string }>('/appointments', {
        patient_id: user.user_id,
        doctor_id: doctorId,
        slot_id: selectedSlot,
        reason,
      });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate('/appointments'), 2000);
      } else {
        setError(res.error?.message || 'Booking failed');
      }
    } catch {
      setError('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading || !doctor) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h1>
        <p className="text-gray-600 mb-6">Your appointment has been confirmed. Redirecting...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/doctors" className="inline-flex items-center text-primary-600 hover:text-primary-500 text-sm font-medium">
        <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Doctors
      </Link>

      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary-100 rounded-xl flex items-center justify-center">
              <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{doctor.full_name}</h2>
              <p className="text-gray-500">{doctor.specialty || 'General Practice'}</p>
              <p className="text-gray-500">{doctor.department_name || 'General'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Select Date & Time</h3>
        </div>
        <div className="card-body space-y-6">
          <div>
            <label htmlFor="appointment-date" className="label-field">Select Date</label>
            <input
              id="appointment-date"
              type="date"
              min={minDate}
              max={maxDate}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot('');
              }}
              className="input-field"
              disabled={booking}
            />
          </div>

          <div>
            <label className="label-field">Available Time Slots</label>
            {slots.length === 0 && selectedDate ? (
              <p className="text-gray-500 text-center py-8">No available slots for this date</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {slots.map((slot) => (
                  <button
                    key={slot.slot_id}
                    type="button"
                    onClick={() => setSelectedSlot(slot.slot_id)}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      selectedSlot === slot.slot_id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                    disabled={booking}
                  >
                    <div className="font-medium text-gray-900">{formatTime(slot.start_time)}</div>
                    <div className="text-sm text-gray-500">{formatTime(slot.end_time)}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="reason" className="label-field">Reason for Visit (Optional)</label>
            <textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field"
              placeholder="e.g., Annual checkup, Follow-up, New symptoms..."
              disabled={booking}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
              {error}
            </div>
          )}

          <button
            onClick={handleBook}
            className="btn-primary w-full"
            disabled={booking || !selectedSlot || !selectedDate}
          >
            {booking ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Booking...</span>
              </span>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}