import React, { useState } from 'react';
import { X, FileText, Calendar, Filter, Download } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onClose }) => {
  const { transactions, customers, properties, units } = useDataStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    reportType: 'revenue',
    dateRange: 'month',
    startDate: '',
    endDate: '',
    includeDetails: true,
    format: 'csv'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reportType || !formData.dateRange) {
      toast.error('Please select report type and date range');
      return;
    }

    // Generate report data based on type
    let reportData: any[] = [];
    let filename = '';

    switch (formData.reportType) {
      case 'revenue':
        reportData = transactions.filter(t => t.status === 'completed').map(t => ({
          'Transaction ID': t.id,
          'Customer': t.customerName,
          'Amount': t.amount,
          'Date': t.transactionDate,
          'Payment Method': t.paymentMethod,
          'Currency': t.currency
        }));
        filename = 'revenue-report';
        break;
      case 'sales':
        reportData = units.filter(u => u.status === 'sold').map(u => {
          const property = properties.find(p => p.id === u.propertyId);
          const customer = customers.find(c => c.id === u.customerId);
          return {
            'Unit Number': u.unitNumber,
            'Property': property?.name || 'Unknown',
            'Customer': customer?.name || 'Unknown',
            'Price': u.price,
            'Sold Date': u.soldAt || 'Unknown'
          };
        });
        filename = 'sales-report';
        break;
      case 'customer':
        reportData = customers.map(c => ({
          'Name': c.name,
          'Email': c.email,
          'Phone': c.phone,
          'Status': c.status,
          'Type': c.type,
          'Total Spent': c.totalSpent,
          'Created': c.createdAt
        }));
        filename = 'customer-report';
        break;
      case 'property':
        reportData = properties.map(p => ({
          'Property Name': p.name,
          'Type': p.type,
          'Location': p.location,
          'Total Units': p.totalUnits,
          'Available Units': p.availableUnits,
          'Sold Units': p.soldUnits,
          'Base Price': p.basePrice,
          'Status': p.status
        }));
        filename = 'property-report';
        break;
    }

    // Generate CSV content
    const csvContent = [
      Object.keys(reportData[0] || {}).join(','),
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Report generated and downloaded successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generate Report</h2>
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
                <FileText className="h-4 w-4 inline mr-1" />
                Report Type *
              </label>
              <select
                value={formData.reportType}
                onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="revenue">Revenue Report</option>
                <option value="sales">Sales Report</option>
                <option value="customer">Customer Report</option>
                <option value="property">Property Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date Range *
              </label>
              <select
                value={formData.dateRange}
                onChange={(e) => setFormData(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {formData.dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="includeDetails"
              checked={formData.includeDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, includeDetails: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="includeDetails" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Include detailed information
            </label>
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate & Download Report
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

export default GenerateReportModal;