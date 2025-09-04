import React, { useState } from 'react';
import { X, Wrench, Save, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
}

interface EditMaintenanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: MaintenanceRequest | null;
  onSave?: (updatedRequest: MaintenanceRequest) => void;
}

const EditMaintenanceRequestModal: React.FC<EditMaintenanceRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  request, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    title: request?.title || '',
    description: request?.description || '',
    type: request?.type || 'corrective',
    priority: request?.priority || 'medium',
    status: request?.status || 'pending',
    scheduledDate: request?.scheduledDate || '',
    completedDate: request?.completedDate || '',
    assignedTo: request?.assignedTo || '',
    cost: request?.cost || 0,
    actualCost: request?.actualCost || 0,
    notes: request?.notes || '',
    estimatedDuration: request?.estimatedDuration || 0,
    actualDuration: request?.actualDuration || 0,
    location: request?.location || '',
    equipment: request?.equipment || '',
    workOrder: request?.workOrder || '',
    materials: request?.materials || []
  });

  const [newMaterial, setNewMaterial] = useState('');

  React.useEffect(() => {
    if (request) {
      setFormData({
        title: request.title,
        description: request.description,
        type: request.type,
        priority: request.priority,
        status: request.status,
        scheduledDate: request.scheduledDate,
        completedDate: request.completedDate || '',
        assignedTo: request.assignedTo,
        cost: request.cost,
        actualCost: request.actualCost || 0,
        notes: request.notes || '',
        estimatedDuration: request.estimatedDuration || 0,
        actualDuration: request.actualDuration || 0,
        location: request.location || '',
        equipment: request.equipment || '',
        workOrder: request.workOrder || '',
        materials: request.materials || []
      });
    }
  }, [request]);

  const maintenanceTypes = [
    { value: 'preventive', label: 'Preventive Maintenance' },
    { value: 'corrective', label: 'Corrective Maintenance' },
    { value: 'emergency', label: 'Emergency Repair' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleAddMaterial = () => {
    if (newMaterial.trim() && !formData.materials.includes(newMaterial.trim())) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const handleRemoveMaterial = (materialToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(material => material !== materialToRemove)
    }));
  };

  const handleSave = () => {
    if (!request) return;

    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (!formData.scheduledDate) {
      toast.error('Scheduled date is required');
      return;
    }

    if (!formData.assignedTo.trim()) {
      toast.error('Assignment is required');
      return;
    }

    if (formData.cost < 0) {
      toast.error('Cost cannot be negative');
      return;
    }

    // Status-specific validations
    if (formData.status === 'completed' && !formData.completedDate) {
      toast.error('Completed date is required for completed requests');
      return;
    }

    if (formData.completedDate && new Date(formData.completedDate) < new Date(formData.scheduledDate)) {
      toast.error('Completed date cannot be before scheduled date');
      return;
    }

    const updatedRequest: MaintenanceRequest = {
      ...request,
      title: formData.title,
      description: formData.description,
      type: formData.type as MaintenanceRequest['type'],
      priority: formData.priority as MaintenanceRequest['priority'],
      status: formData.status as MaintenanceRequest['status'],
      scheduledDate: formData.scheduledDate,
      completedDate: formData.completedDate || undefined,
      assignedTo: formData.assignedTo,
      cost: Number(formData.cost),
      actualCost: formData.actualCost ? Number(formData.actualCost) : undefined,
      notes: formData.notes || undefined,
      estimatedDuration: formData.estimatedDuration ? Number(formData.estimatedDuration) : undefined,
      actualDuration: formData.actualDuration ? Number(formData.actualDuration) : undefined,
      location: formData.location || undefined,
      equipment: formData.equipment || undefined,
      workOrder: formData.workOrder || undefined,
      materials: formData.materials.length > 0 ? formData.materials : undefined
    };

    if (onSave) {
      onSave(updatedRequest);
    }
    
    toast.success('Maintenance request updated successfully!');
    onClose();
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Maintenance Request</h2>
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
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe the maintenance work required..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MaintenanceRequest['type'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {maintenanceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as MaintenanceRequest['priority'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {priorityLevels.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as MaintenanceRequest['status'] }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

          {/* Assignment & Scheduling */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assignment & Scheduling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assigned To *
                </label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Technician or team name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              {formData.status === 'completed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Completed Date *
                  </label>
                  <input
                    type="date"
                    value={formData.completedDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, completedDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Location & Equipment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location & Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Building, floor, room..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Equipment
                </label>
                <input
                  type="text"
                  value={formData.equipment}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Equipment or system name"
                />
              </div>
            </div>
          </div>

          {/* Cost & Time Estimates */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cost & Time Estimates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Cost *
                </label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Actual Cost
                </label>
                <input
                  type="number"
                  value={formData.actualCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, actualCost: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Duration (hrs)
                </label>
                <input
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="0"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Actual Duration (hrs)
                </label>
                <input
                  type="number"
                  value={formData.actualDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, actualDuration: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          {/* Work Order & Materials */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Work Order & Materials</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work Order Details
                </label>
                <textarea
                  value={formData.workOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, workOrder: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Detailed work instructions..."
                />
              </div>

              {/* Materials Management */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Required Materials
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMaterial()}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Add material or part..."
                  />
                  <button
                    onClick={handleAddMaterial}
                    className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {formData.materials.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.materials.map((material, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 text-sm rounded-full"
                      >
                        <span>{material}</span>
                        <button
                          onClick={() => handleRemoveMaterial(material)}
                          className="p-1 hover:bg-orange-200 dark:hover:bg-orange-800/20 rounded-full"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Notes</h3>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Additional notes, special instructions, safety requirements..."
            />
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
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMaintenanceRequestModal;
