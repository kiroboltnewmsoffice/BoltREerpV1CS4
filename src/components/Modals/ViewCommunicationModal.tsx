import React from 'react';
import { X, MessageSquare, Mail, Phone, Calendar, User, Send, Paperclip } from 'lucide-react';

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
  duration?: number; // for calls, in minutes
  response?: string;
}

interface ViewCommunicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  communication: Communication | null;
}

const ViewCommunicationModal: React.FC<ViewCommunicationModalProps> = ({ isOpen, onClose, communication }) => {
  if (!isOpen || !communication) return null;

  const getTypeIcon = () => {
    switch (communication.type) {
      case 'email': return <Mail className="h-5 w-5 text-white" />;
      case 'sms': return <MessageSquare className="h-5 w-5 text-white" />;
      case 'call': return <Phone className="h-5 w-5 text-white" />;
      default: return <MessageSquare className="h-5 w-5 text-white" />;
    }
  };

  const getTypeColor = () => {
    switch (communication.type) {
      case 'email': return 'bg-blue-600';
      case 'sms': return 'bg-green-600';
      case 'call': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'read': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${getTypeColor()} rounded-lg flex items-center justify-center`}>
              {getTypeIcon()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Communication Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{communication.type}</p>
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
          {/* Basic Information */}
          <div className="space-y-6">
            {/* Subject and Status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject/Title
                </label>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {communication.subject}
                </h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(communication.status)}`}>
                  {communication.status.charAt(0).toUpperCase() + communication.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  From
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{communication.fromUserName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">User ID: {communication.fromUserId}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{communication.toCustomerName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID: {communication.toCustomerId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {communication.type === 'call' ? 'Call Notes' : 'Message Content'}
              </label>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {communication.content}
                </p>
              </div>
            </div>

            {/* Attachments */}
            {communication.attachments && communication.attachments.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attachments
                </label>
                <div className="space-y-2">
                  {communication.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{attachment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call Duration */}
            {communication.type === 'call' && communication.duration && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration
                  </label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {communication.duration} minutes
                  </p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sent At
                </label>
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{formatDateTime(communication.sentAt)}</span>
                </div>
              </div>

              {communication.deliveredAt && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Delivered At
                  </label>
                  <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Send className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{formatDateTime(communication.deliveredAt)}</span>
                  </div>
                </div>
              )}

              {communication.readAt && (
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Read At
                  </label>
                  <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{formatDateTime(communication.readAt)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Response */}
            {communication.response && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Response
                </label>
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {communication.response}
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Details */}
            {communication.status === 'failed' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <X className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-800 dark:text-red-400">Delivery Failed</h4>
                </div>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  This message could not be delivered. Please check the recipient's contact information and try again.
                </p>
              </div>
            )}

            {/* Communication Stats */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Communication Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                    {communication.type.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                    {communication.status === 'sent' || communication.status === 'delivered' || communication.status === 'read' ? '✓' : '✗'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Delivered</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                    {communication.attachments ? communication.attachments.length : 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Attachments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                    {communication.response ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Response</p>
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

export default ViewCommunicationModal;

