import React, { useEffect } from 'react';
import { X, Shield, Calendar, DollarSign, MapPin, User, FileText, Wrench, AlertCircle } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciation: number;
  location: string;
  assignedTo: string;
  status: 'active' | 'inactive' | 'maintenance' | 'disposed';
  warrantyExpiry: string;
  maintenanceSchedule: string;
  description?: string;
  vendor?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

interface ViewAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

const ViewAssetModal: React.FC<ViewAssetModalProps> = ({ isOpen, onClose, asset }) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !asset) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'disposed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} EGP`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Asset Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{asset.name}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Asset Name</p>
                  <p className="text-gray-900 dark:text-white font-medium">{asset.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                  <p className="text-gray-900 dark:text-white">{asset.category}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Serial Number</p>
                  <p className="text-gray-900 dark:text-white font-mono">{asset.serialNumber}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Purchase Date</p>
                  <p className="text-gray-900 dark:text-white">{formatDate(asset.purchaseDate)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</p>
                  <p className="text-gray-900 dark:text-white">{asset.assignedTo}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Purchase Price</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(asset.purchasePrice)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Value</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(asset.currentValue)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Depreciation</p>
                  <p className="text-gray-900 dark:text-white">{asset.depreciation}% annually</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-gray-900 dark:text-white">{asset.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                    {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Wrench className="h-5 w-5 mr-2" />
              Maintenance Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Maintenance Schedule</p>
                <p className="text-gray-900 dark:text-white font-medium">{asset.maintenanceSchedule}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Warranty Expiry</p>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(asset.warrantyExpiry)}</p>
              </div>
              {asset.lastMaintenanceDate && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Maintenance</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatDate(asset.lastMaintenanceDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Financial Summary
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Purchase Price</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{formatCurrency(asset.purchasePrice)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Current Value</p>
                  <p className="text-lg font-bold text-green-900 dark:text-green-100">{formatCurrency(asset.currentValue)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Depreciation</p>
                  <p className="text-lg font-bold text-red-900 dark:text-red-100">{formatCurrency(asset.purchasePrice - asset.currentValue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(asset.description || asset.vendor) && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h3>
              {asset.vendor && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendor</p>
                  <p className="text-gray-900 dark:text-white">{asset.vendor}</p>
                </div>
              )}
              {asset.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-white">{asset.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
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

export default ViewAssetModal;
