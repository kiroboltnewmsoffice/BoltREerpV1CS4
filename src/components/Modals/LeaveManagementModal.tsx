import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface LeaveManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  onSubmitLeaveRequest: (employeeId: string, request: any) => void;
}

const LeaveManagementModal: React.FC<LeaveManagementModalProps> = ({ 
  isOpen, 
  onClose, 
  employee,
  onSubmitLeaveRequest 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [activeTab, setActiveTab] = useState('request');
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: '',
    workHandover: ''
  });

  const leaveTypes = [
    { value: 'annual', label: 'Annual Leave', balance: 15 },
    { value: 'sick', label: 'Sick Leave', balance: 5 },
    { value: 'personal', label: 'Personal Leave', balance: 3 },
    { value: 'maternity', label: 'Maternity Leave', balance: 90 },
    { value: 'emergency', label: 'Emergency Leave', balance: 2 }
  ];

  // Sample leave history
  const leaveHistory = [
    {
      id: '1',
      type: 'Annual Leave',
      startDate: '2025-01-15',
      endDate: '2025-01-20',
      days: 5,
      status: 'approved',
      reason: 'Family vacation'
    },
    {
      id: '2',
      type: 'Sick Leave',
      startDate: '2025-02-10',
      endDate: '2025-02-12',
      days: 2,
      status: 'approved',
      reason: 'Medical appointment'
    },
    {
      id: '3',
      type: 'Personal Leave',
      startDate: '2025-03-05',
      endDate: '2025-03-05',
      days: 1,
      status: 'pending',
      reason: 'Personal matters'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    const request = {
      id: Date.now().toString(),
      employeeId: employee.id,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: calculateDays(),
      reason: formData.reason,
      emergencyContact: formData.emergencyContact,
      workHandover: formData.workHandover,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    onSubmitLeaveRequest(employee.id, request);
    toast.success('Leave request submitted successfully');
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Leave Management</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{employee.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {employee.role} • {employee.department}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('request')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'request'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              New Request
            </button>
            <button
              onClick={() => setActiveTab('balance')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'balance'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Leave Balance
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Leave History
            </button>
          </div>

          {/* New Request Tab */}
          {activeTab === 'request' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Leave Type *
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select leave type</option>
                    {leaveTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} ({type.balance} days available)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                  </label>
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    {calculateDays() > 0 ? `${calculateDays()} day(s)` : 'Select dates to calculate'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Reason for Leave *
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please provide a reason for your leave request"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Emergency contact details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Handover Notes
                </label>
                <textarea
                  name="workHandover"
                  value={formData.workHandover}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Details about work handover and coverage arrangements"
                />
              </div>

              <div className="flex justify-end gap-3">
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
                  Submit Request
                </button>
              </div>
            </form>
          )}

          {/* Leave Balance Tab */}
          {activeTab === 'balance' && (
            <div className="space-y-4">
              {leaveTypes.map(type => (
                <div key={type.value} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{type.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Available balance</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{type.balance}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">days</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leave History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {leaveHistory.map(leave => {
                const StatusIcon = getStatusIcon(leave.status);
                return (
                  <div key={leave.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(leave.status)}`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{leave.type}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{leave.reason}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {leave.startDate} to {leave.endDate} ({leave.days} days)
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagementModal;
