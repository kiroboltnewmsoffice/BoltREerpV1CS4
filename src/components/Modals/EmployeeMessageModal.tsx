import React, { useState } from 'react';
import { X, Send, User, MessageSquare, Clock, Phone, Mail, Calendar } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface EmployeeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  onSendMessage: (employeeId: string, message: any) => void;
}

const EmployeeMessageModal: React.FC<EmployeeMessageModalProps> = ({ 
  isOpen, 
  onClose, 
  employee,
  onSendMessage 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [activeTab, setActiveTab] = useState('compose');
  const [formData, setFormData] = useState({
    messageType: 'email',
    subject: '',
    message: '',
    priority: 'normal',
    scheduledSend: false,
    scheduleDate: '',
    scheduleTime: '',
    requestRead: false,
    followUpDate: ''
  });

  const messageTypes = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'sms', label: 'SMS', icon: MessageSquare },
    { value: 'internal', label: 'Internal Message', icon: User },
    { value: 'phone', label: 'Phone Call Reminder', icon: Phone }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  // Sample message history
  const messageHistory = [
    {
      id: '1',
      type: 'email',
      subject: 'Performance Review Schedule',
      message: 'Hi John, your performance review has been scheduled for next week. Please prepare your self-assessment.',
      sentAt: '2025-01-10T10:30:00Z',
      sentBy: 'HR Manager',
      status: 'read',
      priority: 'normal'
    },
    {
      id: '2',
      type: 'sms',
      message: 'Meeting reminder: Team standup at 2 PM today in Conference Room A.',
      sentAt: '2025-01-09T13:45:00Z',
      sentBy: 'Project Manager',
      status: 'delivered',
      priority: 'normal'
    },
    {
      id: '3',
      type: 'internal',
      subject: 'Welcome to the Team!',
      message: 'Welcome aboard! Please check your onboarding checklist and let me know if you have any questions.',
      sentAt: '2025-01-05T09:00:00Z',
      sentBy: 'HR Manager',
      status: 'read',
      priority: 'high'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const getCharacterLimit = () => {
    switch (formData.messageType) {
      case 'sms': return 160;
      case 'email': return 5000;
      case 'internal': return 2000;
      default: return 1000;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (formData.messageType === 'email' && !formData.subject.trim()) {
      toast.error('Please enter a subject for email messages');
      return;
    }

    if (formData.scheduledSend && (!formData.scheduleDate || !formData.scheduleTime)) {
      toast.error('Please specify schedule date and time');
      return;
    }

    const message = {
      id: Date.now().toString(),
      employeeId: employee.id,
      type: formData.messageType,
      subject: formData.subject,
      message: formData.message,
      priority: formData.priority,
      scheduledSend: formData.scheduledSend,
      scheduleDateTime: formData.scheduledSend 
        ? `${formData.scheduleDate}T${formData.scheduleTime}:00Z`
        : null,
      requestRead: formData.requestRead,
      followUpDate: formData.followUpDate || null,
      sentBy: 'Current User', // This would come from auth context
      sentAt: formData.scheduledSend ? null : new Date().toISOString(),
      status: formData.scheduledSend ? 'scheduled' : 'sent'
    };

    onSendMessage(employee.id, message);
    toast.success(formData.scheduledSend ? 'Message scheduled successfully' : 'Message sent successfully');
    
    // Reset form
    setFormData({
      messageType: 'email',
      subject: '',
      message: '',
      priority: 'normal',
      scheduledSend: false,
      scheduleDate: '',
      scheduleTime: '',
      requestRead: false,
      followUpDate: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-blue-600 bg-blue-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'read': return 'text-purple-600 bg-purple-50';
      case 'scheduled': return 'text-orange-600 bg-orange-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    const messageType = messageTypes.find(t => t.value === type);
    return messageType ? messageType.icon : MessageSquare;
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  if (!isOpen || !employee) return null;

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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Employee Messages</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {employee.name} • {employee.role} • {employee.department}
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
          {/* Employee Contact Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {employee.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{employee.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {employee.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {employee.phone || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('compose')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'compose'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Compose Message
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Message History
            </button>
          </div>

          {/* Compose Message Tab */}
          {activeTab === 'compose' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message Type
                  </label>
                  <select
                    name="messageType"
                    value={formData.messageType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {messageTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
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

              {(formData.messageType === 'email' || formData.messageType === 'internal') && (
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
                    placeholder="Enter message subject"
                    required={formData.messageType === 'email' || formData.messageType === 'internal'}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={formData.messageType === 'sms' ? 3 : 6}
                  maxLength={getCharacterLimit()}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter your ${formData.messageType} message...`}
                  required
                />
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                  {formData.message.length}/{getCharacterLimit()} characters
                </div>
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
                    Schedule message for later
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
                        required={formData.scheduledSend}
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
                        required={formData.scheduledSend}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                {formData.messageType === 'email' && (
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
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Follow-up Date (optional)
                  </label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Set a reminder to follow up on this message
                  </p>
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
                  {formData.scheduledSend ? 'Schedule Message' : 'Send Message'}
                </button>
              </div>
            </form>
          )}

          {/* Message History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Message History</h3>
              
              {messageHistory.map(message => {
                const MessageIcon = getMessageTypeIcon(message.type);
                return (
                  <div key={message.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(message.status)}`}>
                          <MessageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {message.subject || `${message.type.toUpperCase()} Message`}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            From: {message.sentBy} • {formatDateTime(message.sentAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {message.status.toUpperCase()}
                        </span>
                        <span className={`text-xs ${priorityOptions.find(p => p.value === message.priority)?.color}`}>
                          {message.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{message.message}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeMessageModal;
