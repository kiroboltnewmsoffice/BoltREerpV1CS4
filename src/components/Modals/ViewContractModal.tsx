import React from 'react';
import { X, FileText, User, Building, DollarSign, Calendar, CheckCircle, Clock, Mail, Download } from 'lucide-react';
import { Contract, Customer, Unit, Property } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface ViewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
  customers: Customer[];
  units: Unit[];
  properties: Property[];
}

const ViewContractModal: React.FC<ViewContractModalProps> = ({ 
  isOpen, 
  onClose, 
  contract, 
  customers, 
  units, 
  properties 
}) => {
  if (!isOpen || !contract) return null;

  const customer = customers.find(c => c.id === contract.customerId);
  const unit = units.find(u => u.id === contract.unitId);
  const property = properties.find(p => p.id === unit?.propertyId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'executed': return 'bg-blue-100 text-blue-800';
      case 'pending_signature': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contract Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contract Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {contract.contractNumber}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(contract.status)}`}>
                  {contract.status.replace('_', ' ').toUpperCase()}
                </span>
                {contract.legalReviewed && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    Legal Reviewed
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Contract Value</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(contract.totalValue)}</p>
            </div>
          </div>

          {/* Contract Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h4>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{customer?.name || 'Unknown'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white">{customer?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white">{customer?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Property Information</h4>
              
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Property</p>
                  <p className="text-gray-900 dark:text-white font-medium">{property?.name || 'Unknown'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Unit</p>
                  <p className="text-gray-900 dark:text-white">{unit?.unitNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Signed Date</p>
                  <p className="text-gray-900 dark:text-white">
                    {format(new Date(contract.signedDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Terms</h4>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">{contract.paymentTerms}</p>
            </div>
          </div>

          {/* Legal Review */}
          {contract.legalReviewed && contract.reviewedBy && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Legal Review</h4>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-800 dark:text-green-200">
                    Contract reviewed and approved by {contract.reviewedBy}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          {contract.documents.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Documents</h4>
              <div className="space-y-2">
                {contract.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{doc}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      Download
                    </button>
                  </div>
                ))}
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

export default ViewContractModal;