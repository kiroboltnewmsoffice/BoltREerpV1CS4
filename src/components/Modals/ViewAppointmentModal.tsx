import React from 'react';
import { X, Calendar, Clock, MapPin, User, Building, CheckCircle, XCircle, Bell } from 'lucide-react';

interface Appointment {
  id: string;
  title: string;
  description: string;
  customerId: string;
  customerName: string;
  employeeId: string;
  employeeName: string;
  propertyId?: string;
  propertyName?: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'viewing' | 'meeting' | 'consultation' | 'signing';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reminders?: string[];
}

interface ViewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

const ViewAppointmentModal: React.FC<ViewAppointmentModalProps> = ({ isOpen, onClose, appointment }) => {
  if (!isOpen || !appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'no-show': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'viewing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'meeting': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'consultation': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'signing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getDuration = () => {
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appointment Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Title and Status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {appointment.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {appointment.description}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status === 'completed' && <CheckCircle className="h-4 w-4 mr-1" />}
                  {appointment.status === 'cancelled' && <XCircle className="h-4 w-4 mr-1" />}
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(appointment.type)}`}>
                  {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                </span>
              </div>
            </div>

            {/* Date and Time Information */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Schedule Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDateTime(appointment.startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">End Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDateTime(appointment.endTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getDuration()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Participants</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                    <p className="font-medium text-gray-900 dark:text-white">{appointment.customerName}</p>
                    <p className="text-xs text-gray-400">ID: {appointment.customerId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Employee</p>
                    <p className="font-medium text-gray-900 dark:text-white">{appointment.employeeName}</p>
                    <p className="text-xs text-gray-400">ID: {appointment.employeeId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Location</h4>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <MapPin className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{appointment.location}</p>
                  {appointment.propertyName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Property: {appointment.propertyName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Property Details */}
            {appointment.propertyId && appointment.propertyName && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Property Information</h4>
                <div className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Building className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{appointment.propertyName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Property ID: {appointment.propertyId}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {appointment.notes && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Notes</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {appointment.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Reminders */}
            {appointment.reminders && appointment.reminders.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Reminders</h4>
                <div className="space-y-2">
                  {appointment.reminders.map((reminder, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Bell className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{reminder}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status-specific Information */}
            {appointment.status === 'cancelled' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-800 dark:text-red-400">Appointment Cancelled</h4>
                </div>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  This appointment has been cancelled. Please reschedule if needed.
                </p>
              </div>
            )}

            {appointment.status === 'completed' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-800 dark:text-green-400">Appointment Completed</h4>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  This appointment was completed successfully.
                </p>
              </div>
            )}

            {/* Summary Stats */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Appointment Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                    {appointment.type.charAt(0).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                    {getDuration()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                    {appointment.reminders ? appointment.reminders.length : 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reminders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                    {appointment.status === 'completed' ? '✓' : '○'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointmentModal;

