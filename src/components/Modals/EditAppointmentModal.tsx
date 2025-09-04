import React, { useState } from 'react';
import { X, Calendar, Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

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

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSave?: (updatedAppointment: Appointment) => void;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({ 
  isOpen, 
  onClose, 
  appointment, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    title: appointment?.title || '',
    description: appointment?.description || '',
    startTime: appointment?.startTime || '',
    endTime: appointment?.endTime || '',
    location: appointment?.location || '',
    type: appointment?.type || 'viewing',
    status: appointment?.status || 'scheduled',
    notes: appointment?.notes || '',
    reminders: appointment?.reminders || []
  });

  const [newReminder, setNewReminder] = useState('');

  React.useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title,
        description: appointment.description,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        location: appointment.location,
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes || '',
        reminders: appointment.reminders || []
      });
    }
  }, [appointment]);

  const appointmentTypes = [
    { value: 'viewing', label: 'Property Viewing' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'signing', label: 'Contract Signing' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' }
  ];

  const reminderOptions = [
    '15 minutes before',
    '30 minutes before',
    '1 hour before',
    '2 hours before',
    '1 day before',
    '2 days before',
    '1 week before'
  ];

  const handleAddReminder = () => {
    if (newReminder.trim() && !formData.reminders.includes(newReminder.trim())) {
      setFormData(prev => ({
        ...prev,
        reminders: [...prev.reminders, newReminder.trim()]
      }));
      setNewReminder('');
    }
  };

  const handleRemoveReminder = (reminderToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(reminder => reminder !== reminderToRemove)
    }));
  };

  const handleSave = () => {
    if (!appointment) return;

    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (!formData.startTime) {
      toast.error('Start time is required');
      return;
    }

    if (!formData.endTime) {
      toast.error('End time is required');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Location is required');
      return;
    }

    // Time validation
    const startDate = new Date(formData.startTime);
    const endDate = new Date(formData.endTime);
    
    if (endDate <= startDate) {
      toast.error('End time must be after start time');
      return;
    }

    // Check if start time is in the past (only for new appointments or rescheduling)
    if (formData.status === 'scheduled' && startDate < new Date()) {
      toast.error('Start time cannot be in the past');
      return;
    }

    const updatedAppointment: Appointment = {
      ...appointment,
      title: formData.title,
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      type: formData.type as Appointment['type'],
      status: formData.status as Appointment['status'],
      notes: formData.notes || undefined,
      reminders: formData.reminders.length > 0 ? formData.reminders : undefined
    };

    if (onSave) {
      onSave(updatedAppointment);
    }
    
    toast.success('Appointment updated successfully!');
    onClose();
  };

  const formatDateTimeForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Appointment</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {appointment.customerName} - {appointment.employeeName}
              </p>
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
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appointment Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe the appointment purpose..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Appointment['type'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {appointmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Appointment['status'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formatDateTimeForInput(formData.startTime)}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formatDateTimeForInput(formData.endTime)}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address/Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter full address or location details"
                required
              />
            </div>
          </div>

          {/* Participants Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Participants</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Customer</p>
                <p className="font-medium text-gray-900 dark:text-white">{appointment.customerName}</p>
                <p className="text-xs text-gray-400">ID: {appointment.customerId}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Employee</p>
                <p className="font-medium text-gray-900 dark:text-white">{appointment.employeeName}</p>
                <p className="text-xs text-gray-400">ID: {appointment.employeeId}</p>
              </div>
            </div>
          </div>

          {/* Reminders */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reminders</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <select
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a reminder</option>
                  {reminderOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <button
                  onClick={handleAddReminder}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {formData.reminders.length > 0 && (
                <div className="space-y-2">
                  {formData.reminders.map((reminder, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                    >
                      <span className="text-gray-900 dark:text-white">{reminder}</span>
                      <button
                        onClick={() => handleRemoveReminder(reminder)}
                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Additional notes, special instructions, requirements..."
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFormData(prev => ({ ...prev, status: 'confirmed' }))}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Appointment
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, status: 'completed' }))}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark Complete
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, status: 'cancelled' }))}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Appointment
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
                  setFormData(prev => ({ 
                    ...prev, 
                    startTime: now.toISOString().slice(0, 16),
                    endTime: oneHourLater.toISOString().slice(0, 16)
                  }));
                }}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
              >
                Set to Now
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAppointmentModal;
