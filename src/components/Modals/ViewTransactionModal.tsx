import React from 'react';
import { X, DollarSign, User, CreditCard, Calendar, FileText, Building } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';

interface ViewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const ViewTransactionModal: React.FC<ViewTransactionModalProps> = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'cheque': return 'bg-blue-100 text-blue-800';
      case 'bank_transfer': return 'bg-purple-100 text-purple-800';
      case 'instapay': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPaymentMethod = (method: string) => {
    return method.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transaction Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Transaction Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Transaction {transaction.id.toUpperCase()}
              </h3>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                  {formatPaymentMethod(transaction.paymentMethod)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(transaction.amount)}</p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Information</h4>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                  <p className="text-gray-900 dark:text-white font-medium">{transaction.customerName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payee</p>
                  <p className="text-gray-900 dark:text-white">{transaction.payeeDetails}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Processed by</p>
                  <p className="text-gray-900 dark:text-white">{transaction.accountant}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Details</h4>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Date</p>
                  <p className="text-gray-900 dark:text-white">
                    {format(new Date(transaction.transactionDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              {transaction.dueDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                    <p className="text-gray-900 dark:text-white">
                      {format(new Date(transaction.dueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Currency</p>
                  <p className="text-gray-900 dark:text-white">{transaction.currency}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cheque Details */}
          {transaction.chequeDetails && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cheque Information</h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cheque Number</p>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.chequeDetails.chequeNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bank Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.chequeDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Branch</p>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.chequeDetails.branchName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Number</p>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.chequeDetails.accountNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments */}
          {transaction.comments && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Comments</h4>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">{transaction.comments}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTransactionModal;
