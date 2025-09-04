import React, { useState } from 'react';
import { X, Users, AlertTriangle, ArrowRight, User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface CustomerMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryCustomer: any;
  onMergeCustomers: (primaryId: string, duplicateId: string, mergeData: any) => void;
}

const CustomerMergeModal: React.FC<CustomerMergeModalProps> = ({ 
  isOpen, 
  onClose, 
  primaryCustomer,
  onMergeCustomers 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [selectedDuplicate, setSelectedDuplicate] = useState<any>(null);
  const [mergePreferences, setMergePreferences] = useState({
    name: 'primary',
    email: 'primary',
    phone: 'primary',
    address: 'primary',
    birthDate: 'primary',
    preferences: 'merge',
    notes: 'merge',
    history: 'merge',
    documents: 'merge'
  });

  // Sample duplicate customers
  const potentialDuplicates = [
    {
      id: '2',
      name: 'John Smith Jr.',
      email: 'johnsmith@email.com',
      phone: '+1-555-0123',
      address: '123 Main Street, City, State 12345',
      birthDate: '1985-06-15',
      createdAt: '2025-01-08T10:00:00Z',
      lastActivity: '2025-01-12T14:30:00Z',
      totalTransactions: 2,
      totalValue: 45000,
      confidence: 95,
      duplicateReasons: ['Similar name', 'Same phone number', 'Similar address']
    },
    {
      id: '3',
      name: 'J. Smith',
      email: 'j.smith@different.com',
      phone: '+1-555-0123',
      address: '123 Main St, City, State',
      birthDate: '1985-06-15',
      createdAt: '2025-01-05T16:20:00Z',
      lastActivity: '2025-01-10T09:15:00Z',
      totalTransactions: 1,
      totalValue: 15000,
      confidence: 88,
      duplicateReasons: ['Same phone number', 'Same birth date', 'Similar address format']
    },
    {
      id: '4',
      name: 'John A. Smith',
      email: 'john.smith@company.com',
      phone: '+1-555-9999',
      address: '456 Oak Avenue, City, State 12345',
      birthDate: '1985-06-15',
      createdAt: '2025-01-12T11:45:00Z',
      lastActivity: '2025-01-13T16:00:00Z',
      totalTransactions: 0,
      totalValue: 0,
      confidence: 75,
      duplicateReasons: ['Similar name', 'Same birth date', 'Same city']
    }
  ];

  const mergeFields = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'phone' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'birthDate', label: 'Birth Date', type: 'date' },
    { key: 'preferences', label: 'Customer Preferences', type: 'merge' },
    { key: 'notes', label: 'Notes & Comments', type: 'merge' },
    { key: 'history', label: 'Activity History', type: 'merge' },
    { key: 'documents', label: 'Documents & Files', type: 'merge' }
  ];

  const handleDuplicateSelect = (duplicate: any) => {
    setSelectedDuplicate(duplicate);
  };

  const handleMergePreferenceChange = (field: string, value: string) => {
    setMergePreferences(prev => ({ ...prev, [field]: value }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-red-600 bg-red-50';
    if (confidence >= 80) return 'text-orange-600 bg-orange-50';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getFieldValue = (customer: any, field: string) => {
    switch (field) {
      case 'name': return customer.name;
      case 'email': return customer.email;
      case 'phone': return customer.phone;
      case 'address': return customer.address;
      case 'birthDate': return customer.birthDate;
      default: return 'N/A';
    }
  };

  const handleMerge = () => {
    if (!selectedDuplicate) {
      toast.error('Please select a duplicate customer to merge');
      return;
    }

    const mergeData = {
      mergePreferences,
      duplicateCustomer: selectedDuplicate,
      mergedAt: new Date().toISOString(),
      mergedBy: 'Current User'
    };

    onMergeCustomers(primaryCustomer.id, selectedDuplicate.id, mergeData);
    toast.success(`Successfully merged customers. ${selectedDuplicate.name} has been merged into ${primaryCustomer.name}`);
    onClose();
  };

  if (!isOpen || !primaryCustomer) return null;

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
              <Users className="w-5 h-5" />
              Merge Duplicate Customers
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Primary Customer: {primaryCustomer.name}
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Step 1: Select Duplicate */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                1. Select Duplicate Customer
              </h3>
              
              <div className="space-y-4">
                {potentialDuplicates.map(duplicate => (
                  <div
                    key={duplicate.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedDuplicate?.id === duplicate.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => handleDuplicateSelect(duplicate)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{duplicate.name}</h4>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {duplicate.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {duplicate.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {duplicate.address}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(duplicate.confidence)}`}>
                          {duplicate.confidence}% Match
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {duplicate.totalTransactions} transactions
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Duplicate Reasons:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {duplicate.duplicateReasons.map(reason => (
                            <span key={reason} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div>Created: {formatDate(duplicate.createdAt)}</div>
                        <div>Last Activity: {formatDate(duplicate.lastActivity)}</div>
                        <div>Transactions: {duplicate.totalTransactions}</div>
                        <div>Total Value: {formatCurrency(duplicate.totalValue)}</div>
                      </div>
                    </div>

                    {selectedDuplicate?.id === duplicate.id && (
                      <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm text-blue-800 dark:text-blue-200">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        This customer will be merged into {primaryCustomer.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Configure Merge */}
            {selectedDuplicate && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  2. Configure Merge Settings
                </h3>

                <div className="space-y-4">
                  {mergeFields.map(field => (
                    <div key={field.key} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">{field.label}</h4>
                      
                      {field.type === 'merge' ? (
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={field.key}
                              value="merge"
                              checked={mergePreferences[field.key as keyof typeof mergePreferences] === 'merge'}
                              onChange={(e) => handleMergePreferenceChange(field.key, e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm">Merge both records</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={field.key}
                              value="primary"
                              checked={mergePreferences[field.key as keyof typeof mergePreferences] === 'primary'}
                              onChange={(e) => handleMergePreferenceChange(field.key, e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm">Keep primary customer's {field.label.toLowerCase()}</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={field.key}
                              value="duplicate"
                              checked={mergePreferences[field.key as keyof typeof mergePreferences] === 'duplicate'}
                              onChange={(e) => handleMergePreferenceChange(field.key, e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm">Keep duplicate customer's {field.label.toLowerCase()}</span>
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 gap-3">
                            <label className="flex items-start">
                              <input
                                type="radio"
                                name={field.key}
                                value="primary"
                                checked={mergePreferences[field.key as keyof typeof mergePreferences] === 'primary'}
                                onChange={(e) => handleMergePreferenceChange(field.key, e.target.value)}
                                className="mr-2 mt-1"
                              />
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary:</span>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {getFieldValue(primaryCustomer, field.key)}
                                </div>
                              </div>
                            </label>
                            
                            <label className="flex items-start">
                              <input
                                type="radio"
                                name={field.key}
                                value="duplicate"
                                checked={mergePreferences[field.key as keyof typeof mergePreferences] === 'duplicate'}
                                onChange={(e) => handleMergePreferenceChange(field.key, e.target.value)}
                                className="mr-2 mt-1"
                              />
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Duplicate:</span>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {getFieldValue(selectedDuplicate, field.key)}
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Merge Preview */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Merge Preview</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>After merging:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>{selectedDuplicate.name} will be deactivated</li>
                      <li>All data will be consolidated under {primaryCustomer.name}</li>
                      <li>Transaction history will be preserved and merged</li>
                      <li>This action cannot be undone</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMerge}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Merge Customers
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMergeModal;
