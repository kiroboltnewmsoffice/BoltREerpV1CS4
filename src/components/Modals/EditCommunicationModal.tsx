import React, { useState } from 'react';
import { X, MessageSquare, Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Communication {
  id: string;
  type: 'email' | 'sms' | 'call';
  subject: string;
  content: string;
  fromUserId: string;
  fromUserName: string;
  toCustomerId: string;
  toCustomerName: string;
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'failed';
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  attachments?: string[];
  duration?: number;
  response?: string;
}

interface EditCommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  communication: Communication | null;
  onSave?: (updatedCommunication: Communication) => void;
}

const EditCommunicationModal: React.FC<EditCommunicationModalProps> = ({ 
  isOpen, 
  onClose, 
  communication, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    subject: communication?.subject || '',
    content: communication?.content || '',
    status: communication?.status || 'draft',
    response: communication?.response || '',
    attachments: communication?.attachments || []
  });

  const [newAttachment, setNewAttachment] = useState('');

  React.useEffect(() => {
    if (communication) {
      setFormData({
        subject: communication.subject,
        content: communication.content,
        status: communication.status,
        response: communication.response || '',
        attachments: communication.attachments || []
      });
    }
  }, [communication]);

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'read', label: 'Read' },
    { value: 'failed', label: 'Failed' }
  ];

  const handleAddAttachment = () => {
    if (newAttachment.trim() && !formData.attachments.includes(newAttachment.trim())) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment.trim()]
      }));
      setNewAttachment('');
    }
  };

  const handleRemoveAttachment = (attachmentToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(attachment => attachment !== attachmentToRemove)
    }));
  };

  const handleSave = () => {
    if (!communication) return;

    // Basic validation
    if (!formData.subject.trim()) {
      toast.error('Subject is required');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    const updatedCommunication: Communication = {
      ...communication,
      subject: formData.subject,
      content: formData.content,
      status: formData.status as Communication['status'],
      response: formData.response || undefined,
      attachments: formData.attachments.length > 0 ? formData.attachments : undefined,
      // Update timestamps based on status changes
      deliveredAt: formData.status === 'delivered' && !communication.deliveredAt ? 
        new Date().toISOString() : communication.deliveredAt,
      readAt: formData.status === 'read' && !communication.readAt ? 
        new Date().toISOString() : communication.readAt
    };

    if (onSave) {
      onSave(updatedCommunication);
    }
    
    toast.success('Communication updated successfully!');
    onClose();
  };

  const handleSendFollowUp = () => {
    if (!communication) return;

    if (!formData.response.trim()) {
      toast.error('Please add follow-up content');
      return;
    }

    // In a real app, this would create a new communication record
    toast.success('Follow-up message sent successfully!');
    onClose();
  };

  if (!isOpen || !communication) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Communication</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {communication.type.charAt(0).toUpperCase() + communication.type.slice(1)} - {communication.toCustomerName}
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Message Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject/Title *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter message content..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Communication['status'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <input
                    type="text"
                    value={communication.type.charAt(0).toUpperCase() + communication.type.slice(1)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attachments Management */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attachments</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAttachment()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add attachment name or URL..."
                />
                <button
                  onClick={handleAddAttachment}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <span className="text-gray-900 dark:text-white">{attachment}</span>
                      <button
                        onClick={() => handleRemoveAttachment(attachment)}
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

          {/* Customer Response */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Response</h3>
            <textarea
              value={formData.response}
              onChange={(e) => setFormData(prev => ({ ...prev, response: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Record customer response or add follow-up notes..."
            />
          </div>

          {/* Communication History */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Original Message Info</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">From</p>
                <p className="font-medium text-gray-900 dark:text-white">{communication.fromUserName}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">To</p>
                <p className="font-medium text-gray-900 dark:text-white">{communication.toCustomerName}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Sent</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(communication.sentAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{communication.type}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSendFollowUp}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Follow-up
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, status: 'read' }))}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark as Read
              </button>
              <button
                onClick={() => setFormData(prev => ({ ...prev, response: 'Customer confirmed receipt and understanding.' }))}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Confirmation
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

export default EditCommunicationModal;

