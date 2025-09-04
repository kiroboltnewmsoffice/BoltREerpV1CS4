import React, { useState } from 'react';
import { X, Workflow, Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEscapeKey } from '../../hooks/useEscapeKey';

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

interface EditWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: WorkflowData | null;
  onSave?: (updatedWorkflow: WorkflowData) => void;
}

const EditWorkflowModal: React.FC<EditWorkflowModalProps> = ({ 
  isOpen, 
  onClose, 
  workflow, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: workflow?.name || '',
    description: workflow?.description || '',
    module: workflow?.module || 'CRM',
    status: workflow?.status || 'draft',
    steps: workflow?.steps || []
  });

  const [newStep, setNewStep] = useState({
    name: '',
    assignedRole: 'customer_service',
    isRequired: true
  });

  // Handle ESC key press with custom hook
  useEscapeKey(isOpen, onClose);

  React.useEffect(() => {
    if (workflow) {
      setFormData({
        name: workflow.name,
        description: workflow.description,
        module: workflow.module,
        status: workflow.status,
        steps: [...workflow.steps]
      });
    }
  }, [workflow]);

  const modules = [
    'CRM',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'Marketing',
    'Support'
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const roleOptions = [
    'customer_service',
    'sales_representative',
    'sales_manager',
    'finance_manager',
    'hr_manager',
    'operations_manager',
    'marketing_specialist',
    'support_agent',
    'admin'
  ];

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleAddStep = () => {
    if (!newStep.name.trim()) {
      toast.error('Step name is required');
      return;
    }

    const step: WorkflowStep = {
      id: Date.now().toString(),
      name: newStep.name,
      assignedRole: newStep.assignedRole,
      order: formData.steps.length + 1,
      isRequired: newStep.isRequired
    };

    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, step]
    }));

    setNewStep({
      name: '',
      assignedRole: 'customer_service',
      isRequired: true
    });
  };

  const handleRemoveStep = (stepId: string) => {
    const updatedSteps = formData.steps
      .filter(step => step.id !== stepId)
      .map((step, index) => ({ ...step, order: index + 1 }));
    
    setFormData(prev => ({
      ...prev,
      steps: updatedSteps
    }));
  };

  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = formData.steps.findIndex(step => step.id === stepId);
    if ((direction === 'up' && stepIndex === 0) || 
        (direction === 'down' && stepIndex === formData.steps.length - 1)) {
      return;
    }

    const newSteps = [...formData.steps];
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    
    [newSteps[stepIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[stepIndex]];
    
    // Update order numbers
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index + 1
    }));

    setFormData(prev => ({
      ...prev,
      steps: reorderedSteps
    }));
  };

  const handleStepChange = (stepId: string, field: keyof WorkflowStep, value: any) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, [field]: value } : step
      )
    }));
  };

  const handleSave = () => {
    if (!workflow) return;

    // Basic validation
    if (!formData.name.trim()) {
      toast.error('Workflow name is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Workflow description is required');
      return;
    }

    if (formData.steps.length === 0) {
      toast.error('At least one step is required');
      return;
    }

    // Check for duplicate step names
    const stepNames = formData.steps.map(s => s.name.toLowerCase());
    if (new Set(stepNames).size !== stepNames.length) {
      toast.error('Step names must be unique');
      return;
    }

    const updatedWorkflow: WorkflowData = {
      ...workflow,
      name: formData.name,
      description: formData.description,
      module: formData.module,
      status: formData.status as WorkflowData['status'],
      steps: formData.steps
    };

    if (onSave) {
      onSave(updatedWorkflow);
    }
    
    toast.success('Workflow updated successfully!');
    onClose();
  };

  if (!isOpen || !workflow) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Workflow className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Workflow</h2>
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
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workflow Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workflow Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe the workflow purpose and process..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Module *
                  </label>
                  <select
                    value={formData.module}
                    onChange={(e) => setFormData(prev => ({ ...prev, module: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {modules.map((module) => (
                      <option key={module} value={module}>
                        {module}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as WorkflowData['status'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workflow Steps</h3>
            
            {/* Add New Step */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add New Step</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    value={newStep.name}
                    onChange={(e) => setNewStep(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Step name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <select
                    value={newStep.assignedRole}
                    onChange={(e) => setNewStep(prev => ({ ...prev, assignedRole: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {formatRole(role)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newStep.isRequired}
                      onChange={(e) => setNewStep(prev => ({ ...prev, isRequired: e.target.checked }))}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Required</span>
                  </label>
                  <button
                    onClick={handleAddStep}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Steps */}
            <div className="space-y-3">
              {formData.steps.map((step, index) => (
                <div key={step.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                  <div className="flex items-center space-x-4">
                    {/* Step Number */}
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {step.order}
                      </span>
                    </div>

                    {/* Step Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                      <div>
                        <input
                          type="text"
                          value={step.name}
                          onChange={(e) => handleStepChange(step.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <select
                          value={step.assignedRole}
                          onChange={(e) => handleStepChange(step.id, 'assignedRole', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {roleOptions.map((role) => (
                            <option key={role} value={role}>
                              {formatRole(role)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={step.isRequired}
                            onChange={(e) => handleStepChange(step.id, 'isRequired', e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Required</span>
                        </label>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleMoveStep(step.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveStep(step.id, 'down')}
                        disabled={index === formData.steps.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveStep(step.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {formData.steps.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No steps defined. Add at least one step to complete the workflow.
                </div>
              )}
            </div>
          </div>

          {/* Workflow Summary */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Workflow Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                  {formData.steps.length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Total Steps</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                  {formData.steps.filter(s => s.isRequired).length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Required</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  {formData.steps.filter(s => !s.isRequired).length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Optional</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                  {[...new Set(formData.steps.map(s => s.assignedRole))].length}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Roles</p>
              </div>
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
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWorkflowModal;
