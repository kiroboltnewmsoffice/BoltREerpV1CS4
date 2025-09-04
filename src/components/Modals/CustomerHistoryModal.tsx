import React, { useState } from 'react';
import { X, History, Calendar, User, Phone, Mail, MapPin, DollarSign, FileText, Filter, Search } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface CustomerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  customer 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Sample customer history data
  const customerHistory = [
    {
      id: '1',
      type: 'contact',
      title: 'Initial Phone Call',
      description: 'Customer called inquiring about 3-bedroom properties. Discussed budget and preferences.',
      date: '2025-01-10T10:30:00Z',
      user: 'John Agent',
      details: {
        phone: customer.phone,
        duration: '15 minutes',
        outcome: 'Scheduled property viewing'
      }
    },
    {
      id: '2',
      type: 'email',
      title: 'Property Listings Sent',
      description: 'Sent curated list of 5 properties matching customer criteria.',
      date: '2025-01-10T14:45:00Z',
      user: 'John Agent',
      details: {
        emailSubject: 'Properties Matching Your Criteria',
        attachments: 5,
        opened: true
      }
    },
    {
      id: '3',
      type: 'viewing',
      title: 'Property Viewing',
      description: 'Showed customer 3 properties on Main Street, Oak Avenue, and Pine Road.',
      date: '2025-01-11T15:00:00Z',
      user: 'Sarah Agent',
      details: {
        properties: ['123 Main St', '456 Oak Ave', '789 Pine Rd'],
        duration: '3 hours',
        feedback: 'Interested in Main Street property'
      }
    },
    {
      id: '4',
      type: 'financial',
      title: 'Pre-approval Submitted',
      description: 'Helped customer submit mortgage pre-approval application.',
      date: '2025-01-12T09:15:00Z',
      user: 'Financial Advisor',
      details: {
        amount: 650000,
        bank: 'City Bank',
        status: 'Approved',
        validUntil: '2025-03-15'
      }
    },
    {
      id: '5',
      type: 'offer',
      title: 'Offer Submitted',
      description: 'Customer submitted offer for 123 Main Street property.',
      date: '2025-01-13T11:30:00Z',
      user: 'John Agent',
      details: {
        property: '123 Main Street',
        offerAmount: 625000,
        listingPrice: 650000,
        status: 'Under review'
      }
    },
    {
      id: '6',
      type: 'meeting',
      title: 'Contract Review Meeting',
      description: 'Met with customer to review purchase contract and terms.',
      date: '2025-01-14T16:00:00Z',
      user: 'Legal Team',
      details: {
        location: 'Office Conference Room',
        duration: '2 hours',
        documentsReviewed: ['Purchase Agreement', 'Inspection Report', 'Title Report']
      }
    },
    {
      id: '7',
      type: 'payment',
      title: 'Earnest Money Received',
      description: 'Received earnest money deposit for property purchase.',
      date: '2025-01-15T10:00:00Z',
      user: 'Accounting',
      details: {
        amount: 10000,
        method: 'Bank Transfer',
        reference: 'EM-2025-001'
      }
    }
  ];

  const historyTypes = [
    { value: 'all', label: 'All Activities', icon: History },
    { value: 'contact', label: 'Communications', icon: Phone },
    { value: 'email', label: 'Emails', icon: Mail },
    { value: 'viewing', label: 'Property Viewings', icon: MapPin },
    { value: 'financial', label: 'Financial', icon: DollarSign },
    { value: 'offer', label: 'Offers & Contracts', icon: FileText },
    { value: 'meeting', label: 'Meetings', icon: User },
    { value: 'payment', label: 'Payments', icon: DollarSign }
  ];

  const dateFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const getTypeIcon = (type: string) => {
    const historyType = historyTypes.find(t => t.value === type);
    const IconComponent = historyType?.icon || History;
    return IconComponent;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      contact: 'bg-blue-100 text-blue-800',
      email: 'bg-green-100 text-green-800',
      viewing: 'bg-purple-100 text-purple-800',
      financial: 'bg-yellow-100 text-yellow-800',
      offer: 'bg-orange-100 text-orange-800',
      meeting: 'bg-indigo-100 text-indigo-800',
      payment: 'bg-emerald-100 text-emerald-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filterHistoryByDate = (history: any[], filter: string) => {
    if (filter === 'all') return history;
    
    const now = new Date();
    const startDate = new Date();
    
    switch (filter) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return history.filter(item => new Date(item.date) >= startDate);
  };

  const filteredHistory = filterHistoryByDate(
    customerHistory.filter(item => {
      const matchesType = activeTab === 'all' || item.type === activeTab;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.user.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    }),
    dateFilter
  );

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderActivityDetails = (activity: any) => {
    const details = activity.details;
    
    switch (activity.type) {
      case 'contact':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Duration: {details.duration}</div>
            <div>Outcome: {details.outcome}</div>
          </div>
        );
        
      case 'email':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Subject: {details.emailSubject}</div>
            <div>Attachments: {details.attachments}</div>
            <div>Status: {details.opened ? 'Opened' : 'Sent'}</div>
          </div>
        );
        
      case 'viewing':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Properties: {details.properties.join(', ')}</div>
            <div>Duration: {details.duration}</div>
            <div>Feedback: {details.feedback}</div>
          </div>
        );
        
      case 'financial':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Amount: {formatCurrency(details.amount)}</div>
            <div>Bank: {details.bank}</div>
            <div>Status: {details.status}</div>
            <div>Valid Until: {details.validUntil}</div>
          </div>
        );
        
      case 'offer':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Property: {details.property}</div>
            <div>Offer: {formatCurrency(details.offerAmount)} (List: {formatCurrency(details.listingPrice)})</div>
            <div>Status: {details.status}</div>
          </div>
        );
        
      case 'meeting':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Location: {details.location}</div>
            <div>Duration: {details.duration}</div>
            <div>Documents: {details.documentsReviewed.join(', ')}</div>
          </div>
        );
        
      case 'payment':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Amount: {formatCurrency(details.amount)}</div>
            <div>Method: {details.method}</div>
            <div>Reference: {details.reference}</div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!isOpen || !customer) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5" />
              Customer History
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {customer.name} • {filteredHistory.length} activities
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
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Activity Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {historyTypes.map(type => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setActiveTab(type.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === type.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* History Timeline */}
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No activities found matching your criteria
              </div>
            ) : (
              filteredHistory.map((activity, index) => {
                const IconComponent = getTypeIcon(activity.type);
                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline line */}
                    {index < filteredHistory.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
                    )}
                    
                    <div className="flex gap-4">
                      {/* Timeline icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(activity.type)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      {/* Activity content */}
                      <div className="flex-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{activity.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                            {historyTypes.find(t => t.value === activity.type)?.label}
                          </span>
                        </div>
                        
                        {renderActivityDetails(activity)}
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {activity.user}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDateTime(activity.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHistoryModal;
