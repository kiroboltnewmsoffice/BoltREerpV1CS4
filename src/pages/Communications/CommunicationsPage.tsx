import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Send,
  Eye,
  Reply,
  Forward
} from 'lucide-react';
import { User as UserIcon } from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import toast from 'react-hot-toast';
import SendEmailModal from '../../components/Modals/SendEmailModal';
import SendSMSModal from '../../components/Modals/SendSMSModal';

const CommunicationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);

  // Sample communications data
  const communications = [
    {
      id: '1',
      type: 'email' as const,
      subject: 'Property Inquiry - Cairo Heights',
      content: 'Customer interested in 2-bedroom units with city view',
      fromUserId: '3',
      fromUserName: 'Mike Wilson',
      toCustomerId: '1',
      toCustomerName: 'Ahmed Hassan',
      status: 'sent' as const,
      sentAt: '2024-01-25T10:30:00',
      attachments: []
    },
    {
      id: '2',
      type: 'sms' as const,
      subject: 'Payment Reminder',
      content: 'Your installment payment of EGP 127,500 is due on February 15th. Please contact us for payment arrangements.',
      fromUserId: '2',
      fromUserName: 'Sarah Johnson',
      toCustomerId: '1',
      toCustomerName: 'Ahmed Hassan',
      status: 'delivered' as const,
      sentAt: '2024-01-24T14:15:00',
      attachments: []
    },
    {
      id: '3',
      type: 'call' as const,
      subject: 'Follow-up Call - Property Viewing',
      content: 'Discussed unit specifications and payment options. Customer requested additional information about amenities.',
      fromUserId: '3',
      fromUserName: 'Mike Wilson',
      toCustomerId: '2',
      toCustomerName: 'Fatima Al Zahra',
      status: 'completed' as const,
      sentAt: '2024-01-23T16:45:00',
      attachments: []
    }
  ];

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.toCustomerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || comm.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || comm.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'sms': return 'bg-green-100 text-green-800';
      case 'call': return 'bg-purple-100 text-purple-800';
      case 'meeting': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-purple-100 text-purple-800';
      case 'replied': return 'bg-indigo-100 text-indigo-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'call': return Phone;
      case 'meeting': return Calendar;
      default: return MessageSquare;
    }
  };

  const totalCommunications = communications.length;
  const emailCount = communications.filter(c => c.type === 'email').length;
  const smsCount = communications.filter(c => c.type === 'sms').length;
  const callCount = communications.filter(c => c.type === 'call').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Communications Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customer communications and interactions</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowEmailModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            type="button"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </button>
          <button 
            onClick={() => setShowSMSModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            type="button"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Send SMS
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Communications"
          value={totalCommunications}
          change="This month"
          changeType="neutral"
          icon={MessageSquare}
          color="blue"
        />
        <StatsCard
          title="Emails Sent"
          value={emailCount}
          change="Email communications"
          changeType="neutral"
          icon={Mail}
          color="green"
        />
        <StatsCard
          title="SMS Sent"
          value={smsCount}
          change="Text messages"
          changeType="neutral"
          icon={MessageSquare}
          color="purple"
        />
        <StatsCard
          title="Calls Made"
          value={callCount}
          change="Phone interactions"
          changeType="neutral"
          icon={Phone}
          color="yellow"
        />
      </div>

      {/* Communications List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Communications ({filteredCommunications.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredCommunications.map((comm) => {
            const TypeIcon = getTypeIcon(comm.type);
            
            return (
              <div key={comm.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        comm.type === 'email' ? 'bg-blue-100' :
                        comm.type === 'sms' ? 'bg-green-100' :
                        comm.type === 'call' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <TypeIcon className={`h-5 w-5 ${
                          comm.type === 'email' ? 'text-blue-600' :
                          comm.type === 'sms' ? 'text-green-600' :
                          comm.type === 'call' ? 'text-purple-600' : 'text-gray-600'
                        }`} />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{comm.subject}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(comm.type)}`}>
                          {comm.type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comm.status)}`}>
                          {comm.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{comm.content}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          From: {comm.fromUserName}
                        </div>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          To: {comm.toCustomerName || 'Internal'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(comm.sentAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={() => {
                        toast.success(`Opening communication details: ${comm.subject}`);
                        // TODO: Implement ViewCommunicationModal
                      }}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => toast.success(`Replying to: ${comm.subject}`)}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      type="button"
                    >
                      <Reply className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => toast.success(`Forwarding: ${comm.subject}`)}
                      className="text-gray-400 hover:text-purple-600 transition-colors"
                      type="button"
                    >
                      <Forward className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <SendEmailModal 
        isOpen={showEmailModal} 
        onClose={() => setShowEmailModal(false)} 
      />
      
      <SendSMSModal 
        isOpen={showSMSModal} 
        onClose={() => setShowSMSModal(false)} 
      />
    </div>
  );
};

export default CommunicationsPage;