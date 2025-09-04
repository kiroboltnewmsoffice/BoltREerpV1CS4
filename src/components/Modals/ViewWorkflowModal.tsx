import React, { useEffect } from 'react';
import { X, Workflow, CheckCircle, Clock, User, Calendar, Play, Settings } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  assignedRole: string;
  order: number;
  isRequired: boolean;
}

interface WorkflowData {
  id: string;
  name: string;
  description: string;
  module: string;
  status: 'active' | 'inactive' | 'draft';
  createdBy: string;
  createdAt: string;
  steps: WorkflowStep[];
}

interface ViewWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: WorkflowData | null;
}

const ViewWorkflowModal: React.FC<ViewWorkflowModalProps> = ({ isOpen, onClose, workflow }) => {
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

  if (!isOpen || !workflow) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getModuleColor = (module: string) => {
    switch (module.toLowerCase()) {
      case 'crm': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'sales': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'hr': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'finance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'operations': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Workflow className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Workflow Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{workflow.name}</p>
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
        <div className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {workflow.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {workflow.description}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.status)}`}>
                  {workflow.status === 'active' && <Play className="h-3 w-3 mr-1" />}
                  {workflow.status === 'inactive' && <Clock className="h-3 w-3 mr-1" />}
                  {workflow.status === 'draft' && <Settings className="h-3 w-3 mr-1" />}
                  {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getModuleColor(workflow.module)}`}>
                  {workflow.module}
                </span>
              </div>
            </div>

            {/* Workflow Metadata */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Workflow Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created By</p>
                    <p className="font-medium text-gray-900 dark:text-white">{workflow.createdBy}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(workflow.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Steps</p>
                    <p className="font-medium text-gray-900 dark:text-white">{workflow.steps.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Workflow Steps */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Workflow Steps</h4>
              <div className="space-y-4">
                {workflow.steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Connection Line */}
                    {index < workflow.steps.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200 dark:bg-gray-600"></div>
                    )}
                    
                    <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      {/* Step Number */}
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          {step.order}
                        </span>
                      </div>
                      
                      {/* Step Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">{step.name}</h5>
                          <div className="flex items-center space-x-2">
                            {step.isRequired && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                Required
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Assigned to: <span className="font-medium">{formatRole(step.assignedRole)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Statistics */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Workflow Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                    {workflow.steps.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Steps</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                    {workflow.steps.filter(s => s.isRequired).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Required</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                    {workflow.steps.filter(s => !s.isRequired).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Optional</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                    {[...new Set(workflow.steps.map(s => s.assignedRole))].length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Roles</p>
                </div>
              </div>
            </div>

            {/* Role Assignments */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Role Assignments</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...new Set(workflow.steps.map(s => s.assignedRole))].map(role => {
                  const stepsForRole = workflow.steps.filter(s => s.assignedRole === role);
                  return (
                    <div key={role} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {formatRole(role)}
                        </h5>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stepsForRole.length} step{stepsForRole.length !== 1 ? 's' : ''}: {' '}
                        {stepsForRole.map(s => s.name).join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Information */}
            <div className={`rounded-lg p-4 ${
              workflow.status === 'active' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : workflow.status === 'inactive'
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {workflow.status === 'active' && <CheckCircle className="h-5 w-5 text-green-600" />}
                {workflow.status === 'inactive' && <Clock className="h-5 w-5 text-red-600" />}
                {workflow.status === 'draft' && <Settings className="h-5 w-5 text-gray-600" />}
                <h4 className={`font-medium ${
                  workflow.status === 'active' 
                    ? 'text-green-800 dark:text-green-400' 
                    : workflow.status === 'inactive'
                    ? 'text-red-800 dark:text-red-400'
                    : 'text-gray-800 dark:text-gray-400'
                }`}>
                  Workflow Status: {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                </h4>
              </div>
              <p className={`text-sm ${
                workflow.status === 'active' 
                  ? 'text-green-700 dark:text-green-300' 
                  : workflow.status === 'inactive'
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {workflow.status === 'active' && 'This workflow is currently active and can be used for new processes.'}
                {workflow.status === 'inactive' && 'This workflow is inactive and cannot be used for new processes.'}
                {workflow.status === 'draft' && 'This workflow is in draft mode and needs to be activated before use.'}
              </p>
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

export default ViewWorkflowModal;
