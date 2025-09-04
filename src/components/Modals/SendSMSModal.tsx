import React, { useState } from 'react';
import { X, MessageSquare, User, Send } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface SendSMSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendSMSModal: React.FC<SendSMSModalProps> = ({ isOpen, onClose }) => {
  const { customers } = useDataStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    toCustomerId: '',
    content: '',
    scheduledAt: ''
  });

  const maxLength = 160;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.toCustomerId || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.content.length > maxLength) {
      toast.error(`Message too long. Maximum ${maxLength} characters allowed.`);
      return;
    }

    const customer = customers.find(c => c.id === formData.toCustomerId);
    if (!customer) {
      toast.error('Customer not found');
      return;
    }

    const smsData = {
      type: 'sms' as const,
      subject: 'SMS Message',
      content: formData.content,
      fromUserId: user?.id || '',
      toCustomerId: formData.toCustomerId,
      status: formData.scheduledAt ? 'draft' as const : 'sent' as const,
      scheduledAt: formData.scheduledAt || undefined,
      sentAt: formData.scheduledAt ? undefined : new Date().toISOString(),
      attachments: []
    };

    console.log('Sending SMS:', smsData);
    toast.success(`SMS ${formData.scheduledAt ? 'scheduled' : 'sent'} successfully!`);
    onClose();
    
    // Reset form
    setFormData({
      toCustomerId: '',
      content: '',
      scheduledAt: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Send SMS</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              To Customer *
            </label>
            <select
              value={formData.toCustomerId}
              onChange={(e) => setFormData(prev => ({ ...prev, toCustomerId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Schedule Send (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MessageSquare className="h-4 w-4 inline mr-1" />
              Message *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              maxLength={maxLength}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Type your SMS message here..."
              required
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>SMS Message</span>
              <span>{formData.content.length}/{maxLength}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <Send className="h-4 w-4 mr-2" />
              {formData.scheduledAt ? 'Schedule SMS' : 'Send SMS'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendSMSModal;