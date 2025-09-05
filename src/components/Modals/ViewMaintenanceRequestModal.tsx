import React from 'react';
import { X, Wrench, Calendar, User, DollarSign, AlertTriangle, CheckCircle, Clock, Building, FileText, MapPin } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

interface MaintenanceRequest {
  id: string;
  assetId: string;
  propertyId?: string;
  title: string;
  description: string;
  type: 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  assignedTo: string;
  cost: number;
  actualCost?: number;
  notes?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  location?: string;
  equipment?: string;
  workOrder?: string;
  materials?: string[];
  images?: string[];
}

interface ViewMaintenanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: MaintenanceRequest | null;
}

const ViewMaintenanceRequestModal: React.FC<ViewMaintenanceRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  request 
}) => {
  if (!isOpen || !request) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'corrective': return 'bg-orange-100 text-orange-800';
      case 'preventive': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Wrench;
      case 'scheduled': return Calendar;
      case 'pending': return Clock;
      case 'cancelled': return AlertTriangle;
      default: return Clock;
    }
  };

  const StatusIcon = getStatusIcon(request.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Maintenance Request</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{request.title}</p>
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
          {/* Request Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Request Overview</h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{request.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{request.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {request.status.replace('_', ' ').charAt(0).toUpperCase() + request.status.replace('_', ' ').slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(request.priority)}`}>
                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(request.type)}`}>
                  {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Scheduled Date</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(request.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{request.assignedTo}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Cost</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(request.cost)}
                    </p>
                  </div>
                </div>

                {request.completedDate && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Completed Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(request.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {request.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{request.location}</p>
                    </div>
                  </div>
                )}

                {request.equipment && (
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Equipment</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{request.equipment}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cost & Time Tracking */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost & Time Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cost Analysis */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Cost Analysis</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(request.cost)}
                    </span>
                  </div>
                  {request.actualCost && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Actual Cost</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(request.actualCost)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Variance</span>
                        <span className={`font-semibold ${
                          request.actualCost > request.cost ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatCurrency(request.actualCost - request.cost)} 
                          ({request.actualCost > request.cost ? '+' : ''}
                          {(((request.actualCost - request.cost) / request.cost) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Time Tracking */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Time Tracking</h4>
                <div className="space-y-4">
                  {request.estimatedDuration && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Estimated Duration</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {request.estimatedDuration} hours
                      </span>
                    </div>
                  )}
                  {request.actualDuration && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Actual Duration</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {request.actualDuration} hours
                        </span>
                      </div>
                      {request.estimatedDuration && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Time Variance</span>
                          <span className={`font-semibold ${
                            request.actualDuration > request.estimatedDuration ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {request.actualDuration > request.estimatedDuration ? '+' : ''}
                            {request.actualDuration - request.estimatedDuration} hours
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Days Since Created</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {Math.floor((new Date().getTime() - new Date(request.scheduledDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Materials & Work Order */}
          {(request.materials || request.workOrder) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Work Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {request.workOrder && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Work Order</h4>
                    <p className="text-gray-700 dark:text-gray-300">{request.workOrder}</p>
                  </div>
                )}

                {request.materials && request.materials.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Required Materials</h4>
                    <div className="space-y-2">
                      {request.materials.map((material, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-gray-700 dark:text-gray-300">{material}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {request.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{request.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Priority Level</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 capitalize">
                      {request.priority}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Estimated Cost</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {formatCurrency(request.cost)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Type</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 capitalize">
                      {request.type}
                    </p>
                  </div>
                  <Wrench className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Status</p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 capitalize">
                      {request.status.replace('_', ' ')}
                    </p>
                  </div>
                  <StatusIcon className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
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

export default ViewMaintenanceRequestModal;

