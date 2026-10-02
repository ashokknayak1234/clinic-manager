import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Doctor, Department } from '../types';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get<{ items: Department[] }>('/departments'),
          api.get<{ items: Doctor[] }>('/doctors'),
        ]);

        if (deptRes.success && deptRes.data) {
          setDepartments(deptRes.data.items);
        }
        if (docRes.success && docRes.data) {
          setDoctors(docRes.data.items);
        } else {
          setError(docRes.error?.message || 'Failed to load doctors');
        }
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDoctors = selectedDepartment
    ? doctors.filter(d => d.department_id === selectedDepartment)
    : doctors;

  const getStatusBadge = (isActive: boolean) => (
    <span className={`badge ${isActive ? 'badge-success' : 'badge-gray'}`}>
      {isActive ? 'Available' : 'Unavailable'}
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Doctors</h1>
          <p className="text-gray-600 mt-1">Find and book appointments with our specialists</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label htmlFor="department-filter" className="label-field">Filter by Department</label>
              <select
                id="department-filter"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="input-field"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <p className="mt-2 text-gray-600">No doctors found</p>
              {selectedDepartment && (
                <button
                  onClick={() => setSelectedDepartment('')}
                  className="mt-4 text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.doctor_id} className="card hover:shadow-md transition-shadow">
                  <div className="card-body">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{doctor.full_name}</h3>
                          {getStatusBadge(doctor.is_active)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{doctor.specialty || 'General Practice'}</p>
                        <p className="text-sm text-gray-500">{doctor.department_name || 'General'}</p>
                        <p className="text-sm text-primary-600 font-medium mt-1">
                          Consultation Fee: ${doctor.consultation_fee.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        to={`/doctors/${doctor.doctor_id}/book`}
                        className="btn-primary w-full text-center"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}