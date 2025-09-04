import React, { useState } from 'react';
import { X, Bell, Calendar, Clock, Mail, MessageSquare } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface TaskReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onSetReminder: (taskId: string, reminder: any) => void;
}

const TaskReminderModal: React.FC<TaskReminderModalProps> = ({ 
  isOpen, 
  onClose, 
  task,
  onSetReminder 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [formData, setFormData] = useState({
    type: 'notification',
    datetime: '',
    frequency: 'once',
    message: '',
    enabled: true
  });

  const reminderTypes = [
    { value: 'notification', label: 'In-App Notification', icon: Bell },
    { value: 'email', label: 'Email Reminder', icon: Mail },
    { value: 'sms', label: 'SMS Reminder', icon: MessageSquare }
  ];

  const frequencies = [
    { value: 'once', label: 'One Time' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.datetime) {
      toast.error('Please select a reminder date and time');
      return;
    }

    const reminder = {
      id: Date.now().toString(),
      taskId: task.id,
      type: formData.type,
      datetime: formData.datetime,
      frequency: formData.frequency,
      message: formData.message || `Reminder: ${task.title}`,
      enabled: formData.enabled,
      createdAt: new Date().toISOString()
    };

    onSetReminder(task.id, reminder);
    toast.success('Reminder set successfully');
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Set Task Reminder</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{task.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set up a reminder for this task
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reminder Type
              </label>
              <div className="space-y-2">
                {reminderTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <label
                      key={type.value}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.type === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">{type.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="datetime"
                value={formData.datetime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Frequency
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {frequencies.map(freq => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter custom reminder message..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="enabled"
                checked={formData.enabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable reminder immediately
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Set Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskReminderModal;
