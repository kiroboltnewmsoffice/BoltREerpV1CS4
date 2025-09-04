import React, { useState } from 'react';
import { X, Shield, Save, Calendar, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEscapeKey } from '../../hooks/useEscapeKey';

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

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onSave?: (updatedAsset: Asset) => void;
}

const EditAssetModal: React.FC<EditAssetModalProps> = ({ 
  isOpen, 
  onClose, 
  asset, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    category: asset?.category || '',
    serialNumber: asset?.serialNumber || '',
    purchaseDate: asset?.purchaseDate || '',
    purchasePrice: asset?.purchasePrice || 0,
    currentValue: asset?.currentValue || 0,
    depreciation: asset?.depreciation || 0,
    location: asset?.location || '',
    assignedTo: asset?.assignedTo || '',
    status: asset?.status || 'active',
    warrantyExpiry: asset?.warrantyExpiry || '',
    maintenanceSchedule: asset?.maintenanceSchedule || '',
    description: asset?.description || '',
    vendor: asset?.vendor || '',
    lastMaintenanceDate: asset?.lastMaintenanceDate || '',
    nextMaintenanceDate: asset?.nextMaintenanceDate || ''
  });

  // Handle ESC key press with custom hook
  useEscapeKey(isOpen, onClose);

  React.useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        category: asset.category,
        serialNumber: asset.serialNumber,
        purchaseDate: asset.purchaseDate,
        purchasePrice: asset.purchasePrice,
        currentValue: asset.currentValue,
        depreciation: asset.depreciation,
        location: asset.location,
        assignedTo: asset.assignedTo,
        status: asset.status,
        warrantyExpiry: asset.warrantyExpiry,
        maintenanceSchedule: asset.maintenanceSchedule,
        description: asset.description || '',
        vendor: asset.vendor || '',
        lastMaintenanceDate: asset.lastMaintenanceDate || '',
        nextMaintenanceDate: asset.nextMaintenanceDate || ''
      });
    }
  }, [asset]);

  const handleSave = () => {
    if (!asset) return;

    const updatedAsset: Asset = {
      ...asset,
      ...formData,
      purchasePrice: Number(formData.purchasePrice),
      currentValue: Number(formData.currentValue),
      depreciation: Number(formData.depreciation),
      status: formData.status as Asset['status']
    };

    if (onSave) {
      onSave(updatedAsset);
    }
    
    toast.success('Asset updated successfully!');
    onClose();
  };

  if (!isOpen || !asset) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Asset</h2>
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
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Asset Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Category</option>
                  <option value="Heavy Equipment">Heavy Equipment</option>
                  <option value="Office Equipment">Office Equipment</option>
                  <option value="IT Equipment">IT Equipment</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Tools & Machinery">Tools & Machinery</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Serial Number *
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assigned To *
                </label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Asset['status'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="disposed">Disposed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purchase Price (EGP) *
                </label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Value (EGP) *
                </label>
                <input
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentValue: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Depreciation Rate (% per year)
                </label>
                <input
                  type="number"
                  value={formData.depreciation}
                  onChange={(e) => setFormData(prev => ({ ...prev, depreciation: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Important Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Warranty Expiry
                </label>
                <input
                  type="date"
                  value={formData.warrantyExpiry}
                  onChange={(e) => setFormData(prev => ({ ...prev, warrantyExpiry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Maintenance Date
                </label>
                <input
                  type="date"
                  value={formData.lastMaintenanceDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastMaintenanceDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Next Maintenance Date
                </label>
                <input
                  type="date"
                  value={formData.nextMaintenanceDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, nextMaintenanceDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vendor/Supplier
                </label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maintenance Schedule
                </label>
                <select
                  value={formData.maintenanceSchedule}
                  onChange={(e) => setFormData(prev => ({ ...prev, maintenanceSchedule: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select Schedule</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Semi-Annual">Semi-Annual</option>
                  <option value="Annual">Annual</option>
                  <option value="As Needed">As Needed</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Additional asset details, specifications, or notes..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAssetModal;
