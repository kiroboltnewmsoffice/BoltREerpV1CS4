import React, { useState } from 'react';
import { X, DollarSign, TrendingUp, Calendar, FileText, Calculator } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface SalaryUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  onUpdateSalary: (employeeId: string, salaryData: any) => void;
}

const SalaryUpdateModal: React.FC<SalaryUpdateModalProps> = ({ 
  isOpen, 
  onClose, 
  employee,
  onUpdateSalary 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [formData, setFormData] = useState({
    currentSalary: employee?.salary || 0,
    newSalary: '',
    increaseType: 'amount',
    increaseValue: '',
    effectiveDate: '',
    reason: '',
    performanceRating: '',
    marketAdjustment: false,
    promotionLevel: '',
    bonusAmount: '',
    notes: ''
  });

  const increaseTypes = [
    { value: 'amount', label: 'Fixed Amount' },
    { value: 'percentage', label: 'Percentage' }
  ];

  const reasonOptions = [
    { value: 'performance', label: 'Performance Review' },
    { value: 'promotion', label: 'Promotion' },
    { value: 'market', label: 'Market Adjustment' },
    { value: 'cost_of_living', label: 'Cost of Living' },
    { value: 'retention', label: 'Retention' },
    { value: 'other', label: 'Other' }
  ];

  const performanceRatings = [
    { value: 'exceptional', label: 'Exceptional (5.0)', multiplier: 1.15 },
    { value: 'exceeds', label: 'Exceeds Expectations (4.0)', multiplier: 1.08 },
    { value: 'meets', label: 'Meets Expectations (3.0)', multiplier: 1.03 },
    { value: 'below', label: 'Below Expectations (2.0)', multiplier: 1.0 },
    { value: 'unsatisfactory', label: 'Unsatisfactory (1.0)', multiplier: 1.0 }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const calculateNewSalary = () => {
    const current = parseFloat(formData.currentSalary.toString()) || 0;
    const increase = parseFloat(formData.increaseValue) || 0;
    
    if (formData.increaseType === 'percentage') {
      return current + (current * increase / 100);
    } else {
      return current + increase;
    }
  };

  const calculateIncreasePercentage = () => {
    const current = parseFloat(formData.currentSalary.toString()) || 0;
    const newSal = parseFloat(formData.newSalary) || calculateNewSalary();
    
    if (current > 0) {
      return ((newSal - current) / current * 100).toFixed(2);
    }
    return '0';
  };

  const getRecommendedIncrease = () => {
    const rating = performanceRatings.find(r => r.value === formData.performanceRating);
    if (rating) {
      const current = parseFloat(formData.currentSalary.toString()) || 0;
      return (current * (rating.multiplier - 1)).toFixed(0);
    }
    return '0';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.newSalary && !formData.increaseValue) {
      toast.error('Please specify salary increase amount or new salary');
      return;
    }

    if (!formData.effectiveDate || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const finalNewSalary = formData.newSalary || calculateNewSalary();
    const increaseAmount = finalNewSalary - parseFloat(formData.currentSalary.toString());
    const increasePercentage = calculateIncreasePercentage();

    const salaryData = {
      id: Date.now().toString(),
      employeeId: employee.id,
      previousSalary: parseFloat(formData.currentSalary.toString()),
      newSalary: finalNewSalary,
      increaseAmount,
      increasePercentage,
      effectiveDate: formData.effectiveDate,
      reason: formData.reason,
      performanceRating: formData.performanceRating,
      marketAdjustment: formData.marketAdjustment,
      promotionLevel: formData.promotionLevel,
      bonusAmount: parseFloat(formData.bonusAmount) || 0,
      notes: formData.notes,
      approvedBy: 'Current User', // This would come from auth context
      approvedAt: new Date().toISOString(),
      status: 'pending_approval'
    };

    onUpdateSalary(employee.id, salaryData);
    toast.success('Salary update submitted for approval');
    onClose();
  };

  if (!isOpen || !employee) return null;

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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Salary Update</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {employee.name} • {employee.role} • {employee.department}
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Salary Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-900 dark:text-blue-100">Current Salary Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Current Salary:</span>
                  <div className="font-semibold text-lg">${formData.currentSalary.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Annual:</span>
                  <div className="font-semibold">${(formData.currentSalary * 12).toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Last Review:</span>
                  <div className="font-semibold">{employee.lastReview || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Salary Increase Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Increase Type
                </label>
                <select
                  name="increaseType"
                  value={formData.increaseType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {increaseTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Increase Value
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="increaseValue"
                    value={formData.increaseValue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pl-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={formData.increaseType === 'percentage' ? '5.5' : '1000'}
                    step={formData.increaseType === 'percentage' ? '0.1' : '100'}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {formData.increaseType === 'percentage' ? '%' : '$'}
                  </span>
                </div>
              </div>
            </div>

            {/* Alternative: Direct New Salary Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Or Enter New Salary Directly
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="newSalary"
                  value={formData.newSalary}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pl-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new monthly salary"
                  step="100"
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            {/* Calculation Preview */}
            {(formData.increaseValue || formData.newSalary) && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-900 dark:text-green-100">Salary Calculation Preview</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-green-700 dark:text-green-300">New Monthly Salary:</span>
                    <div className="font-semibold text-lg">${(formData.newSalary || calculateNewSalary()).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-green-700 dark:text-green-300">Increase Amount:</span>
                    <div className="font-semibold">${((formData.newSalary || calculateNewSalary()) - formData.currentSalary).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-green-700 dark:text-green-300">Increase Percentage:</span>
                    <div className="font-semibold">{calculateIncreasePercentage()}%</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Effective Date *
                </label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Increase *
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select reason</option>
                  {reasonOptions.map(reason => (
                    <option key={reason.value} value={reason.value}>{reason.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Performance Rating
                </label>
                <select
                  name="performanceRating"
                  value={formData.performanceRating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select rating</option>
                  {performanceRatings.map(rating => (
                    <option key={rating.value} value={rating.value}>{rating.label}</option>
                  ))}
                </select>
                {formData.performanceRating && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Recommended increase: ${getRecommendedIncrease()}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Promotion Level (if applicable)
                </label>
                <input
                  type="text"
                  name="promotionLevel"
                  value={formData.promotionLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Senior Developer, Team Lead"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                One-time Bonus Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="bonusAmount"
                  value={formData.bonusAmount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pl-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional bonus amount"
                  step="100"
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="marketAdjustment"
                checked={formData.marketAdjustment}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                This is a market adjustment to maintain competitive compensation
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional context, justification, or notes about this salary update"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit for Approval
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalaryUpdateModal;
