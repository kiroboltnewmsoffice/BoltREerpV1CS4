import React, { useState } from 'react';
import { X, Phone, Calendar, Clock, User, MapPin, FileText, Bell } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface CallSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
  onScheduleCall: (customerId: string, call: any) => void;
}

const CallSchedulerModal: React.FC<CallSchedulerModalProps> = ({ 
  isOpen, 
  onClose, 
  customer,
  onScheduleCall 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [formData, setFormData] = useState({
    callType: 'outbound',
    purpose: '',
    date: '',
    time: '',
    duration: '30',
    phoneNumber: customer?.phone || '',
    agenda: '',
    priority: 'normal',
    reminder: true,
    reminderMinutes: '15',
    notes: '',
    recurring: false,
    recurringFrequency: 'weekly',
    recurringEnd: '',
    assignedTo: ''
  });

  const callPurposes = [
    { value: 'follow_up', label: 'Follow-up Call' },
    { value: 'property_inquiry', label: 'Property Inquiry Discussion' },
    { value: 'appointment_scheduling', label: 'Appointment Scheduling' },
    { value: 'contract_discussion', label: 'Contract Discussion' },
    { value: 'payment_discussion', label: 'Payment Discussion' },
    { value: 'complaint_resolution', label: 'Complaint Resolution' },
    { value: 'feedback_collection', label: 'Feedback Collection' },
    { value: 'market_update', label: 'Market Update' },
    { value: 'maintenance_coordination', label: 'Maintenance Coordination' },
    { value: 'other', label: 'Other' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const durationOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' }
  ];

  const reminderOptions = [
    { value: '5', label: '5 minutes before' },
    { value: '10', label: '10 minutes before' },
    { value: '15', label: '15 minutes before' },
    { value: '30', label: '30 minutes before' },
    { value: '60', label: '1 hour before' },
    { value: '120', label: '2 hours before' },
    { value: '1440', label: '1 day before' }
  ];

  const recurringOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  // Sample team members for assignment
  const teamMembers = [
    { id: '1', name: 'John Smith', role: 'Sales Agent' },
    { id: '2', name: 'Sarah Johnson', role: 'Senior Agent' },
    { id: '3', name: 'Mike Davis', role: 'Property Manager' },
    { id: '4', name: 'Emily Brown', role: 'Customer Service' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.purpose || !formData.date || !formData.time || !formData.phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    const callDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    
    if (callDateTime <= now) {
      toast.error('Please select a future date and time');
      return;
    }

    if (formData.recurring && !formData.recurringEnd) {
      toast.error('Please specify an end date for recurring calls');
      return;
    }

    const call = {
      id: Date.now().toString(),
      customerId: customer.id,
      customerName: customer.name,
      callType: formData.callType,
      purpose: formData.purpose,
      dateTime: `${formData.date}T${formData.time}:00Z`,
      duration: parseInt(formData.duration),
      phoneNumber: formData.phoneNumber,
      agenda: formData.agenda,
      priority: formData.priority,
      reminder: formData.reminder,
      reminderMinutes: parseInt(formData.reminderMinutes),
      notes: formData.notes,
      recurring: formData.recurring,
      recurringFrequency: formData.recurring ? formData.recurringFrequency : null,
      recurringEnd: formData.recurring ? formData.recurringEnd : null,
      assignedTo: formData.assignedTo || 'Current User',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    };

    onScheduleCall(customer.id, call);
    toast.success('Call scheduled successfully');
    onClose();
  };

  if (!isOpen || !customer) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Schedule Call
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Customer: {customer.name} ({customer.phone})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Call Type and Purpose */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Call Type
                </label>
                <select
                  name="callType"
                  value={formData.callType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="outbound">Outbound Call</option>
                  <option value="callback">Scheduled Callback</option>
                  <option value="conference">Conference Call</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose *
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select purpose</option>
                  {callPurposes.map(purpose => (
                    <option key={purpose.value} value={purpose.value}>{purpose.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date, Time, and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select time</option>
                  {generateTimeSlots().map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone Number and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Assign To
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Assign to me</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.name}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Agenda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Call Agenda
              </label>
              <textarea
                name="agenda"
                value={formData.agenda}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What do you plan to discuss during this call?"
              />
            </div>

            {/* Reminder Settings */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="reminder"
                  checked={formData.reminder}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  <Bell className="w-4 h-4 inline mr-1" />
                  Set reminder
                </label>
              </div>

              {formData.reminder && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reminder Time
                  </label>
                  <select
                    name="reminderMinutes"
                    value={formData.reminderMinutes}
                    onChange={handleInputChange}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {reminderOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Recurring Settings */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="recurring"
                  checked={formData.recurring}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Make this a recurring call
                </label>
              </div>

              {formData.recurring && (
                <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frequency
                    </label>
                    <select
                      name="recurringFrequency"
                      value={formData.recurringFrequency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {recurringOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="recurringEnd"
                      value={formData.recurringEnd}
                      onChange={handleInputChange}
                      min={formData.date}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional notes or special instructions..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Schedule Call
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CallSchedulerModal;
