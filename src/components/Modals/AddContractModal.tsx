import React, { useState } from 'react';
import { X, FileText, User, Building, DollarSign, Calendar } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';

interface AddContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddContractModal: React.FC<AddContractModalProps> = ({ isOpen, onClose }) => {
  const { addContract, customers, units, properties } = useDataStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    customerId: '',
    unitId: '',
    totalValue: 0,
    paymentTerms: '',
    signedDate: new Date().toISOString().split('T')[0],
    status: 'draft' as const,
    legalReviewed: false,
    reviewedBy: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.unitId || formData.totalValue <= 0 || !formData.paymentTerms) {
      toast.error('Please fill in all required fields');
      return;
    }

    const customer = customers.find(c => c.id === formData.customerId);
    const unit = units.find(u => u.id === formData.unitId);
    
    if (!customer || !unit) {
      toast.error('Customer or unit not found');
      return;
    }

    console.log('Adding contract:', formData);
    const contractNumber = `CNT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const contractData = {
      customerId: formData.customerId,
      unitId: formData.unitId,
      contractNumber,
      signedDate: formData.signedDate,
      totalValue: formData.totalValue,
      paymentTerms: formData.paymentTerms,
      status: formData.status,
      documents: [],
      legalReviewed: formData.legalReviewed,
      reviewedBy: formData.reviewedBy || undefined
    };

    addContract(contractData);
    toast.success('Contract created successfully!');
    onClose();
    
    // Reset form
    setFormData({
      customerId: '',
      unitId: '',
      totalValue: 0,
      paymentTerms: '',
      signedDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      legalReviewed: false,
      reviewedBy: ''
    });
  };

  const selectedUnit = units.find(u => u.id === formData.unitId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Contract</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Customer *
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Building className="h-4 w-4 inline mr-1" />
                Unit *
              </label>
              <select
                value={formData.unitId}
                onChange={(e) => {
                  const unitId = e.target.value;
                  const unit = units.find(u => u.id === unitId);
                  setFormData(prev => ({ 
                    ...prev, 
                    unitId,
                    totalValue: unit?.price || 0
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Unit</option>
                {units.filter(u => u.status === 'available').map(unit => {
                  const property = properties.find(p => p.id === unit.propertyId);
                  return (
                    <option key={unit.id} value={unit.id}>
                      {property?.name} - {unit.unitNumber} - {formatCurrency(unit.price)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Total Value (EGP) *
              </label>
              <input
                type="number"
                value={formData.totalValue}
                onChange={(e) => setFormData(prev => ({ ...prev, totalValue: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Contract value"
                min="1"
                step="0.01"
                required
              />
              {selectedUnit && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Unit price: {formatCurrency(selectedUnit.price)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Signed Date *
              </label>
              <input
                type="date"
                value={formData.signedDate}
                onChange={(e) => setFormData(prev => ({ ...prev, signedDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Terms *
            </label>
            <select
              value={formData.paymentTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select Payment Terms</option>
              <option value="Full payment on signing">Full payment on signing</option>
              <option value="10% down payment, 90% in 12 monthly installments">10% down, 12 monthly installments</option>
              <option value="20% down payment, 80% in 18 monthly installments">20% down, 18 monthly installments</option>
              <option value="30% down payment, 70% in 24 monthly installments">30% down, 24 monthly installments</option>
              <option value="Custom payment plan">Custom payment plan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contract Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="draft">Draft</option>
              <option value="pending_signature">Pending Signature</option>
              <option value="signed">Signed</option>
              <option value="executed">Executed</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="legalReviewed"
              checked={formData.legalReviewed}
              onChange={(e) => setFormData(prev => ({ ...prev, legalReviewed: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="legalReviewed" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Legal review completed
            </label>
          </div>

          {formData.legalReviewed && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reviewed By
              </label>
              <input
                type="text"
                value={formData.reviewedBy}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewedBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Legal reviewer name"
              />
            </div>
          )}

          <div className="flex items-center space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Contract
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContractModal;