import React, { useState } from 'react';
import { X, Mail, Send, Calendar, User, FileText, Clock, Tag } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface CustomerEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
  onSendEmail: (customerId: string, email: any) => void;
}

const CustomerEmailModal: React.FC<CustomerEmailModalProps> = ({ 
  isOpen, 
  onClose, 
  customer,
  onSendEmail 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [formData, setFormData] = useState({
    to: customer?.email || '',
    cc: '',
    bcc: '',
    subject: '',
    message: '',
    template: '',
    priority: 'normal',
    scheduledSend: false,
    scheduleDate: '',
    scheduleTime: '',
    requestRead: false,
    followUpDays: '',
    attachments: [] as File[]
  });

  const emailTemplates = [
    { value: '', label: 'Custom Email' },
    { value: 'welcome', label: 'Welcome Email' },
    { value: 'follow_up', label: 'Follow-up Email' },
    { value: 'property_inquiry', label: 'Property Inquiry Response' },
    { value: 'appointment_confirmation', label: 'Appointment Confirmation' },
    { value: 'contract_ready', label: 'Contract Ready Notification' },
    { value: 'payment_reminder', label: 'Payment Reminder' },
    { value: 'thank_you', label: 'Thank You Email' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'maintenance_notice', label: 'Maintenance Notice' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const templateContent = {
    welcome: {
      subject: 'Welcome to [Company Name] - Your Real Estate Journey Begins!',
      message: `Dear ${customer?.name || '[Customer Name]'},

Welcome to [Company Name]! We're thrilled to have you as our valued customer.

Our team is committed to providing you with exceptional real estate services and ensuring your property journey is smooth and successful.

What's next:
• A dedicated agent will be assigned to you
• We'll schedule an initial consultation to understand your needs
• You'll receive regular updates on properties matching your criteria

If you have any questions or need immediate assistance, please don't hesitate to contact us.

Best regards,
[Your Name]
[Company Name]`
    },
    follow_up: {
      subject: 'Following Up on Your Property Inquiry',
      message: `Dear ${customer?.name || '[Customer Name]'},

I hope this email finds you well. I wanted to follow up on your recent inquiry about properties in your preferred area.

Since our last conversation, we have some new listings that might interest you:
• [Property 1 - Brief description]
• [Property 2 - Brief description]
• [Property 3 - Brief description]

Would you like to schedule a viewing for any of these properties? I'm available this week and would be happy to show you around.

Please let me know your availability, and I'll arrange everything for you.

Best regards,
[Your Name]`
    },
    appointment_confirmation: {
      subject: 'Appointment Confirmation - Property Viewing',
      message: `Dear ${customer?.name || '[Customer Name]'},

This email confirms your appointment for property viewing:

Date: [Date]
Time: [Time]
Property: [Property Address]
Agent: [Agent Name]

Please bring:
• Valid ID
• Pre-approval letter (if applicable)
• Any specific questions about the property

If you need to reschedule or cancel, please contact us at least 24 hours in advance.

Looking forward to meeting you!

Best regards,
[Your Name]`
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleTemplateChange = (templateValue: string) => {
    setFormData(prev => ({
      ...prev,
      template: templateValue,
      subject: templateContent[templateValue as keyof typeof templateContent]?.subject || prev.subject,
      message: templateContent[templateValue as keyof typeof templateContent]?.message || prev.message
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.to.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.scheduledSend && (!formData.scheduleDate || !formData.scheduleTime)) {
      toast.error('Please specify schedule date and time');
      return;
    }

    const email = {
      id: Date.now().toString(),
      customerId: customer.id,
      to: formData.to,
      cc: formData.cc,
      bcc: formData.bcc,
      subject: formData.subject,
      message: formData.message,
      template: formData.template,
      priority: formData.priority,
      scheduledSend: formData.scheduledSend,
      scheduleDateTime: formData.scheduledSend 
        ? `${formData.scheduleDate}T${formData.scheduleTime}:00Z`
        : null,
      requestRead: formData.requestRead,
      followUpDays: formData.followUpDays ? parseInt(formData.followUpDays) : null,
      attachments: formData.attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      })),
      sentBy: 'Current User',
      sentAt: formData.scheduledSend ? null : new Date().toISOString(),
      status: formData.scheduledSend ? 'scheduled' : 'sent'
    };

    onSendEmail(customer.id, email);
    toast.success(formData.scheduledSend ? 'Email scheduled successfully' : 'Email sent successfully');
    onClose();
  };

  if (!isOpen || !customer) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Send Email</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              To: {customer.name} ({customer.email})
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
            {/* Email Template Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Email Template
              </label>
              <select
                value={formData.template}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {emailTemplates.map(template => (
                  <option key={template.value} value={template.value}>{template.label}</option>
                ))}
              </select>
            </div>

            {/* Recipients */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To *
                </label>
                <input
                  type="email"
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CC
                </label>
                <input
                  type="email"
                  name="cc"
                  value={formData.cc}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional recipients"
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

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email subject"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email message..."
                required
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Attachments
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              />
              {formData.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Schedule Options */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="scheduledSend"
                  checked={formData.scheduledSend}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Schedule email for later
                </label>
              </div>

              {formData.scheduledSend && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      name="scheduleDate"
                      value={formData.scheduleDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time
                    </label>
                    <input
                      type="time"
                      name="scheduleTime"
                      value={formData.scheduleTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="requestRead"
                  checked={formData.requestRead}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Request read receipt
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Follow-up in (days)
                </label>
                <input
                  type="number"
                  name="followUpDays"
                  value={formData.followUpDays}
                  onChange={handleInputChange}
                  min="1"
                  max="365"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 7"
                />
              </div>
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
                <Send className="w-4 h-4" />
                {formData.scheduledSend ? 'Schedule Email' : 'Send Email'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerEmailModal;
