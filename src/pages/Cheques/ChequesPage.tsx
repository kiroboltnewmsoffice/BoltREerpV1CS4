import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import StatsCard from '../../components/Dashboard/StatsCard';
import AddChequeModal from '../../components/Modals/AddChequeModal';
import ViewTransactionModal from '../../components/Modals/ViewTransactionModal';
import { formatCurrency, formatCurrencyShort } from '../../utils/currency';
import { format, isAfter, isBefore, addDays } from 'date-fns';

const ChequesPage: React.FC = () => {
  const { transactions } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dueDateFilter, setDueDateFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Filter cheque transactions
  const chequeTransactions = transactions.filter(t => t.paymentMethod === 'cheque' && t.chequeDetails);
  
  const filteredCheques = chequeTransactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.chequeDetails?.chequeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.chequeDetails?.bankName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.chequeDetails?.status === statusFilter;
    
    let matchesDueDate = true;
    if (dueDateFilter !== 'all' && transaction.chequeDetails?.dueDate) {
      const dueDate = new Date(transaction.chequeDetails.dueDate);
      const today = new Date();
      
      switch (dueDateFilter) {
        case 'overdue':
          matchesDueDate = isBefore(dueDate, today);
          break;
        case 'due_today':
          matchesDueDate = format(dueDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          break;
        case 'due_week':
          matchesDueDate = isAfter(dueDate, today) && isBefore(dueDate, addDays(today, 7));
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDueDate;
  });

  // Calculate stats
  const totalCheques = chequeTransactions.length;
  const pendingCheques = chequeTransactions.filter(t => t.chequeDetails?.status === 'pending').length;
  const clearedCheques = chequeTransactions.filter(t => t.chequeDetails?.status === 'cleared').length;
  const bouncedCheques = chequeTransactions.filter(t => t.chequeDetails?.status === 'bounced').length;
  const totalValue = chequeTransactions.reduce((sum, t) => sum + t.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleared': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent_to_bank': return 'bg-blue-100 text-blue-800';
      case 'bounced': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cleared': return CheckCircle;
      case 'pending': return Clock;
      case 'sent_to_bank': return CreditCard;
      case 'bounced': return XCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const threeDaysFromNow = addDays(today, 3);
    return isAfter(due, today) && isBefore(due, threeDaysFromNow);
  };

  const isOverdue = (dueDate: string) => {
    return isBefore(new Date(dueDate), new Date());
  };

  const handleMoreChequeOptions = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction && transaction.chequeDetails) {
      const options = [
        'Send to Bank',
        'Mark as Bounced',
        'Cancel Cheque',
        'Print Cheque Copy',
        'Add Follow-up Note',
        'Contact Customer',
        'Cheque History'
      ];
      const selectedOption = window.prompt(`Select an option for cheque ${transaction.chequeDetails.chequeNumber}:\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`);
      if (selectedOption) {
        toast.success(`${options[parseInt(selectedOption) - 1] || 'Option'} selected for cheque ${transaction.chequeDetails.chequeNumber}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cheque Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage post-dated cheques</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              const csvData = filteredCheques.map(t => ({
                'Cheque Number': t.chequeDetails?.chequeNumber || '',
                'Customer': t.customerName,
                'Amount': t.amount,
                'Bank': t.chequeDetails?.bankName || '',
                'Due Date': t.chequeDetails?.dueDate || '',
                'Status': t.chequeDetails?.status || ''
              }));
              
              const csvContent = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `cheques-report-${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              toast.success('Cheque report exported successfully!');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            type="button"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Cheque
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Cheques"
          value={totalCheques}
          change={`${formatCurrencyShort(totalValue)} total value`}
          changeType="neutral"
          icon={CreditCard}
          color="blue"
        />
        <StatsCard
          title="Pending"
          value={pendingCheques}
          change="Awaiting processing"
          changeType="neutral"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Cleared"
          value={clearedCheques}
          change={`${((clearedCheques / totalCheques) * 100).toFixed(1)}% success rate`}
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Bounced"
          value={bouncedCheques}
          change="Require follow-up"
          changeType="negative"
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cheques..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="sent_to_bank">Sent to Bank</option>
              <option value="cleared">Cleared</option>
              <option value="bounced">Bounced</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={dueDateFilter}
              onChange={(e) => setDueDateFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Due Dates</option>
              <option value="overdue">Overdue</option>
              <option value="due_today">Due Today</option>
              <option value="due_week">Due This Week</option>
            </select>
            
            <button className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Cheques Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cheques ({filteredCheques.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cheque Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Bank Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCheques.map((transaction) => {
                const cheque = transaction.chequeDetails!;
                const StatusIcon = getStatusIcon(cheque.status);
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {cheque.chequeNumber}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Transaction: {transaction.id.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.customerName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.transactionDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {cheque.bankName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {cheque.branchName}
                      </div>
                      <div className="text-xs text-gray-400">
                        A/C: {cheque.accountNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className={`text-sm font-medium ${
                            isOverdue(cheque.dueDate) ? 'text-red-600' :
                            isDueSoon(cheque.dueDate) ? 'text-yellow-600' : 'text-gray-900 dark:text-white'
                          }`}>
                            {format(new Date(cheque.dueDate), 'MMM dd, yyyy')}
                          </div>
                          {isOverdue(cheque.dueDate) && (
                            <div className="text-xs text-red-500">Overdue</div>
                          )}
                          {isDueSoon(cheque.dueDate) && !isOverdue(cheque.dueDate) && (
                            <div className="text-xs text-yellow-500">Due Soon</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="h-4 w-4 mr-2" />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cheque.status)}`}>
                          {cheque.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      {cheque.bankProcessedDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Processed: {format(new Date(cheque.bankProcessedDate), 'MMM dd')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            const cheque = transaction.chequeDetails;
                            if (cheque) {
                              setSelectedTransaction(transaction);
                              setShowViewModal(true);
                            }
                          }}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          type="button"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            const cheque = transaction.chequeDetails;
                            if (cheque) {
                              toast.success(`Edit functionality for cheque: ${cheque.chequeNumber}`);
                            }
                          }}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          type="button"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            const cheque = transaction.chequeDetails;
                            if (cheque) {
                              toast.success(`Downloading cheque: ${cheque.chequeNumber}`);
                            }
                          }}
                          className="text-gray-400 hover:text-purple-600 transition-colors"
                          type="button"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleMoreChequeOptions(transaction.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          type="button"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCheques.length === 0 && (
          <div className="p-12 text-center">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No cheques found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search criteria or add a new cheque.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Add New Cheque
            </button>
          </div>
        )}
      </div>

      {/* Due Alerts */}
      {chequeTransactions.some(t => t.chequeDetails && (isOverdue(t.chequeDetails.dueDate) || isDueSoon(t.chequeDetails.dueDate))) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Cheque Alerts</h3>
          </div>
          <div className="space-y-2">
            {chequeTransactions
              .filter(t => t.chequeDetails && (isOverdue(t.chequeDetails.dueDate) || isDueSoon(t.chequeDetails.dueDate)))
              .map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {transaction.chequeDetails!.chequeNumber}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      - {transaction.customerName}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className={`text-sm ${isOverdue(transaction.chequeDetails!.dueDate) ? 'text-red-600' : 'text-yellow-600'}`}>
                      Due: {format(new Date(transaction.chequeDetails!.dueDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      <AddChequeModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <ViewTransactionModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default ChequesPage;