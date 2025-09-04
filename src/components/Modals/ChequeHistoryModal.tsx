import React, { useState } from 'react';
import { X, History, Calendar, User, DollarSign, AlertTriangle, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface ChequeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cheque: any;
}

const ChequeHistoryModal: React.FC<ChequeHistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  cheque 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Sample cheque history data
  const chequeHistory = [
    {
      id: '1',
      action: 'Cheque Issued',
      description: 'Cheque created and issued to customer',
      status: 'issued',
      amount: cheque.amount,
      date: '2025-01-10T09:00:00Z',
      user: 'Accounts Manager',
      details: {
        customerName: cheque.customerName,
        purpose: 'Property deposit refund',
        reference: 'REF-2025-001'
      }
    },
    {
      id: '2',
      action: 'Cheque Deposited',
      description: 'Customer deposited cheque at bank',
      status: 'deposited',
      date: '2025-01-12T14:30:00Z',
      user: 'Bank System',
      details: {
        bankName: 'City Bank',
        branchCode: '1234',
        depositSlip: 'DEP-789456'
      }
    },
    {
      id: '3',
      action: 'Bank Processing',
      description: 'Bank started processing the cheque',
      status: 'processing',
      date: '2025-01-13T10:15:00Z',
      user: 'Bank System',
      details: {
        processingId: 'PROC-456789',
        estimatedClearance: '2025-01-15'
      }
    },
    {
      id: '4',
      action: 'Cheque Bounced',
      description: 'Cheque returned due to insufficient funds',
      status: 'bounced',
      date: '2025-01-14T16:45:00Z',
      user: 'Bank System',
      details: {
        bounceReason: 'Insufficient Funds',
        returnCode: 'NSF-001',
        bankCharges: 35.00
      }
    },
    {
      id: '5',
      action: 'Customer Contacted',
      description: 'Contacted customer about bounced cheque',
      status: 'contact',
      date: '2025-01-14T17:30:00Z',
      user: 'Collection Agent',
      details: {
        contactMethod: 'Phone call',
        outcome: 'Customer acknowledged, promised to deposit funds',
        nextAction: 'Re-present cheque'
      }
    },
    {
      id: '6',
      action: 'Funds Verified',
      description: 'Customer confirmed funds availability',
      status: 'verified',
      date: '2025-01-15T11:00:00Z',
      user: 'Collection Agent',
      details: {
        verificationMethod: 'Bank statement provided',
        availableBalance: 15000.00,
        verifiedBy: 'John Collection'
      }
    },
    {
      id: '7',
      action: 'Cheque Re-presented',
      description: 'Cheque submitted to bank again for clearance',
      status: 'resubmitted',
      date: '2025-01-15T14:20:00Z',
      user: 'Accounts Team',
      details: {
        resubmissionId: 'RESUB-789123',
        expectedClearance: '2025-01-17',
        additionalCharges: 15.00
      }
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'issued', label: 'Issued' },
    { value: 'deposited', label: 'Deposited' },
    { value: 'processing', label: 'Processing' },
    { value: 'cleared', label: 'Cleared' },
    { value: 'bounced', label: 'Bounced' },
    { value: 'resubmitted', label: 'Re-submitted' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued': return Clock;
      case 'deposited': return Clock;
      case 'processing': return Clock;
      case 'cleared': return CheckCircle;
      case 'bounced': return XCircle;
      case 'resubmitted': return RotateCcw;
      case 'cancelled': return XCircle;
      case 'contact': return User;
      case 'verified': return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'issued': return 'bg-blue-100 text-blue-800';
      case 'deposited': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'cleared': return 'bg-green-100 text-green-800';
      case 'bounced': return 'bg-red-100 text-red-800';
      case 'resubmitted': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'contact': return 'bg-indigo-100 text-indigo-800';
      case 'verified': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
    }
    
    return history.filter(item => new Date(item.date) >= startDate);
  };

  const filteredHistory = filterHistoryByDate(
    chequeHistory.filter(item => filterStatus === 'all' || item.status === filterStatus),
    dateRange
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

  const renderActionDetails = (activity: any) => {
    const details = activity.details;
    
    switch (activity.status) {
      case 'issued':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Customer: {details.customerName}</div>
            <div>Purpose: {details.purpose}</div>
            <div>Reference: {details.reference}</div>
          </div>
        );
        
      case 'deposited':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Bank: {details.bankName}</div>
            <div>Branch Code: {details.branchCode}</div>
            <div>Deposit Slip: {details.depositSlip}</div>
          </div>
        );
        
      case 'processing':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Processing ID: {details.processingId}</div>
            <div>Expected Clearance: {details.estimatedClearance}</div>
          </div>
        );
        
      case 'bounced':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Reason: {details.bounceReason}</div>
            <div>Return Code: {details.returnCode}</div>
            <div>Bank Charges: {formatCurrency(details.bankCharges)}</div>
          </div>
        );
        
      case 'contact':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Method: {details.contactMethod}</div>
            <div>Outcome: {details.outcome}</div>
            <div>Next Action: {details.nextAction}</div>
          </div>
        );
        
      case 'verified':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Method: {details.verificationMethod}</div>
            <div>Available Balance: {formatCurrency(details.availableBalance)}</div>
            <div>Verified By: {details.verifiedBy}</div>
          </div>
        );
        
      case 'resubmitted':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Resubmission ID: {details.resubmissionId}</div>
            <div>Expected Clearance: {details.expectedClearance}</div>
            <div>Additional Charges: {formatCurrency(details.additionalCharges)}</div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!isOpen || !cheque) return null;

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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5" />
              Cheque History
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Cheque #{cheque.number} • {formatCurrency(cheque.amount)} • {filteredHistory.length} activities
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
          {/* Cheque Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Cheque Number:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{cheque.number}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{formatCurrency(cheque.amount)}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Current Status:</span>
                <div className={`font-semibold ${cheque.status === 'cleared' ? 'text-green-600' : cheque.status === 'bounced' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {cheque.status.charAt(0).toUpperCase() + cheque.status.slice(1)}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{cheque.customerName}</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* History Timeline */}
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No activities found matching your criteria
              </div>
            ) : (
              filteredHistory.map((activity, index) => {
                const IconComponent = getStatusIcon(activity.status);
                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline line */}
                    {index < filteredHistory.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
                    )}
                    
                    <div className="flex gap-4">
                      {/* Timeline icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      {/* Activity content */}
                      <div className="flex-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{activity.action}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{activity.description}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </span>
                            {activity.amount && (
                              <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                {formatCurrency(activity.amount)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {renderActionDetails(activity)}
                        
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
                          
                          {activity.status === 'bounced' && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertTriangle className="w-3 h-3" />
                              Requires Action
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Summary Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{chequeHistory.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Activities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {chequeHistory.filter(h => h.status === 'cleared').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {chequeHistory.filter(h => h.status === 'bounced').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Bounced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {chequeHistory.filter(h => ['processing', 'deposited', 'resubmitted'].includes(h.status)).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChequeHistoryModal;
