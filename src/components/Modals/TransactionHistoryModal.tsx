import React, { useState } from 'react';
import { X, History, Calendar, User, DollarSign, ArrowUpDown, CreditCard, Building, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}

const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  transaction 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Sample transaction history data
  const transactionHistory = [
    {
      id: '1',
      action: 'Transaction Created',
      description: 'Initial transaction record created in the system',
      type: 'system',
      amount: transaction.amount,
      status: 'pending',
      date: '2025-01-10T08:00:00Z',
      user: 'System',
      details: {
        source: 'Customer Portal',
        method: 'Online Payment',
        reference: 'TXN-2025-001',
        customerInfo: {
          name: transaction.customerName,
          email: 'customer@example.com',
          phone: '+1-555-0123'
        }
      }
    },
    {
      id: '2',
      action: 'Payment Authorization',
      description: 'Payment gateway authorization requested',
      type: 'authorization',
      amount: transaction.amount,
      status: 'processing',
      date: '2025-01-10T08:01:00Z',
      user: 'Payment Gateway',
      details: {
        gateway: 'Stripe',
        authCode: 'AUTH-789456123',
        cardLast4: '1234',
        cardType: 'Visa'
      }
    },
    {
      id: '3',
      action: 'Authorization Approved',
      description: 'Payment authorization successfully approved by bank',
      type: 'authorization',
      amount: transaction.amount,
      status: 'approved',
      date: '2025-01-10T08:02:00Z',
      user: 'Bank System',
      details: {
        bankCode: 'APPROVED',
        avsResult: 'Y',
        cvvResult: 'M',
        riskScore: 'Low'
      }
    },
    {
      id: '4',
      action: 'Funds Captured',
      description: 'Payment amount captured from customer account',
      type: 'capture',
      amount: transaction.amount,
      status: 'captured',
      date: '2025-01-10T08:05:00Z',
      user: 'Payment Processor',
      details: {
        captureId: 'CAP-456789',
        settlementDate: '2025-01-12',
        processingFee: 29.50,
        netAmount: transaction.amount - 29.50
      }
    },
    {
      id: '5',
      action: 'Payment Confirmed',
      description: 'Payment confirmation sent to customer',
      type: 'notification',
      status: 'sent',
      date: '2025-01-10T08:06:00Z',
      user: 'Email Service',
      details: {
        notificationType: 'Payment Confirmation',
        emailSent: true,
        smsSent: true,
        confirmationCode: 'CONF-123456'
      }
    },
    {
      id: '6',
      action: 'Accounting Entry',
      description: 'Transaction recorded in accounting system',
      type: 'accounting',
      amount: transaction.amount,
      status: 'recorded',
      date: '2025-01-10T08:10:00Z',
      user: 'Accounting System',
      details: {
        accountDebit: '1200 - Accounts Receivable',
        accountCredit: '4000 - Sales Revenue',
        journalEntry: 'JE-2025-0001',
        fiscalPeriod: '2025-Q1'
      }
    },
    {
      id: '7',
      action: 'Compliance Check',
      description: 'AML and fraud compliance verification completed',
      type: 'compliance',
      status: 'passed',
      date: '2025-01-10T08:15:00Z',
      user: 'Compliance Engine',
      details: {
        amlStatus: 'Clear',
        fraudScore: 12,
        kycStatus: 'Verified',
        sanctions: 'None'
      }
    },
    {
      id: '8',
      action: 'Settlement Completed',
      description: 'Funds settled to merchant account',
      type: 'settlement',
      amount: transaction.amount - 29.50,
      status: 'settled',
      date: '2025-01-12T10:30:00Z',
      user: 'Bank Settlement',
      details: {
        settlementBatch: 'SETTLE-20250112-001',
        merchantAccount: 'ACCT-789456',
        settlementFee: 5.00,
        finalAmount: transaction.amount - 34.50
      }
    },
    {
      id: '9',
      action: 'Invoice Generated',
      description: 'Invoice automatically generated and sent to customer',
      type: 'invoice',
      amount: transaction.amount,
      status: 'sent',
      date: '2025-01-12T11:00:00Z',
      user: 'Invoice System',
      details: {
        invoiceNumber: 'INV-2025-0001',
        dueDate: '2025-02-11',
        terms: 'Net 30',
        format: 'PDF'
      }
    },
    {
      id: '10',
      action: 'Customer Receipt',
      description: 'Digital receipt delivered to customer email',
      type: 'receipt',
      status: 'delivered',
      date: '2025-01-12T11:05:00Z',
      user: 'Receipt Service',
      details: {
        receiptNumber: 'RCP-789456',
        deliveryMethod: 'Email',
        downloadLink: 'https://receipts.company.com/RCP-789456',
        expiryDate: '2025-07-12'
      }
    }
  ];

  const transactionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'system', label: 'System' },
    { value: 'authorization', label: 'Authorization' },
    { value: 'capture', label: 'Capture' },
    { value: 'notification', label: 'Notification' },
    { value: 'accounting', label: 'Accounting' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'settlement', label: 'Settlement' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'receipt', label: 'Receipt' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest First)' },
    { value: 'date-asc', label: 'Date (Oldest First)' },
    { value: 'type', label: 'Type' },
    { value: 'status', label: 'Status' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return Building;
      case 'authorization': return CheckCircle;
      case 'capture': return CreditCard;
      case 'notification': return User;
      case 'accounting': return DollarSign;
      case 'compliance': return AlertTriangle;
      case 'settlement': return ArrowUpDown;
      case 'invoice': return Calendar;
      case 'receipt': return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'captured': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'recorded': return 'bg-purple-100 text-purple-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'settled': return 'bg-emerald-100 text-emerald-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'authorization': return 'bg-blue-100 text-blue-800';
      case 'capture': return 'bg-green-100 text-green-800';
      case 'notification': return 'bg-indigo-100 text-indigo-800';
      case 'accounting': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-yellow-100 text-yellow-800';
      case 'settlement': return 'bg-emerald-100 text-emerald-800';
      case 'invoice': return 'bg-orange-100 text-orange-800';
      case 'receipt': return 'bg-teal-100 text-teal-800';
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
    }
    
    return history.filter(item => new Date(item.date) >= startDate);
  };

  const sortHistory = (history: any[], sortBy: string) => {
    switch (sortBy) {
      case 'date-desc':
        return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'date-asc':
        return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'type':
        return history.sort((a, b) => a.type.localeCompare(b.type));
      case 'status':
        return history.sort((a, b) => a.status.localeCompare(b.status));
      default:
        return history;
    }
  };

  const filteredHistory = sortHistory(
    filterHistoryByDate(
      transactionHistory.filter(item => filterType === 'all' || item.type === filterType),
      dateRange
    ),
    sortBy
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
    
    switch (activity.type) {
      case 'system':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Source: {details.source}</div>
            <div>Method: {details.method}</div>
            <div>Reference: {details.reference}</div>
            <div>Customer: {details.customerInfo.name}</div>
          </div>
        );
        
      case 'authorization':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Gateway: {details.gateway || 'N/A'}</div>
            <div>Auth Code: {details.authCode || 'N/A'}</div>
            {details.cardLast4 && <div>Card: ****{details.cardLast4} ({details.cardType})</div>}
            {details.riskScore && <div>Risk Score: {details.riskScore}</div>}
          </div>
        );
        
      case 'capture':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Capture ID: {details.captureId}</div>
            <div>Settlement Date: {details.settlementDate}</div>
            <div>Processing Fee: {formatCurrency(details.processingFee)}</div>
            <div>Net Amount: {formatCurrency(details.netAmount)}</div>
          </div>
        );
        
      case 'notification':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Type: {details.notificationType}</div>
            <div>Email: {details.emailSent ? 'Sent' : 'Not Sent'}</div>
            <div>SMS: {details.smsSent ? 'Sent' : 'Not Sent'}</div>
            <div>Confirmation: {details.confirmationCode}</div>
          </div>
        );
        
      case 'accounting':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Debit: {details.accountDebit}</div>
            <div>Credit: {details.accountCredit}</div>
            <div>Journal Entry: {details.journalEntry}</div>
            <div>Period: {details.fiscalPeriod}</div>
          </div>
        );
        
      case 'compliance':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>AML Status: {details.amlStatus}</div>
            <div>Fraud Score: {details.fraudScore}</div>
            <div>KYC Status: {details.kycStatus}</div>
            <div>Sanctions: {details.sanctions}</div>
          </div>
        );
        
      case 'settlement':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Batch: {details.settlementBatch}</div>
            <div>Account: {details.merchantAccount}</div>
            <div>Settlement Fee: {formatCurrency(details.settlementFee)}</div>
            <div>Final Amount: {formatCurrency(details.finalAmount)}</div>
          </div>
        );
        
      case 'invoice':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Invoice #: {details.invoiceNumber}</div>
            <div>Due Date: {details.dueDate}</div>
            <div>Terms: {details.terms}</div>
            <div>Format: {details.format}</div>
          </div>
        );
        
      case 'receipt':
        return (
          <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div>Receipt #: {details.receiptNumber}</div>
            <div>Delivery: {details.deliveryMethod}</div>
            <div>Expires: {details.expiryDate}</div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5" />
              Transaction History
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Transaction #{transaction.id} • {formatCurrency(transaction.amount)} • {filteredHistory.length} events
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
          {/* Transaction Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{transaction.id}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{formatCurrency(transaction.amount)}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{transaction.type}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <div className={`font-semibold ${transaction.status === 'completed' ? 'text-green-600' : transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{transaction.customerName}</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {transactionTypes.map(option => (
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* History Timeline */}
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No events found matching your criteria
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
                            <h4 className="font-semibold text-gray-900 dark:text-white">{activity.action}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{activity.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                              </span>
                            </div>
                            {activity.amount && (
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatCurrency(activity.amount)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {renderActionDetails(activity)}
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {activity.user}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDateTime(activity.date)}
                          </span>
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
              <div className="text-2xl font-bold text-blue-600">{transactionHistory.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {transactionHistory.filter(h => ['approved', 'captured', 'settled', 'passed'].includes(h.status)).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {transactionHistory.filter(h => ['pending', 'processing'].includes(h.status)).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {transactionHistory.filter(h => ['failed', 'rejected'].includes(h.status)).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryModal;
