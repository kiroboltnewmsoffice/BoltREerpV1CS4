import React, { useState } from 'react';
import { X, Flag, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface TaskPriorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onUpdatePriority: (taskId: string, priority: string) => void;
}

const TaskPriorityModal: React.FC<TaskPriorityModalProps> = ({ 
  isOpen, 
  onClose, 
  task,
  onUpdatePriority 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [selectedPriority, setSelectedPriority] = useState(task?.priority || 'medium');

  const priorities = [
    { value: 'low', label: 'Low Priority', icon: Clock, color: 'text-green-600', bgColor: 'bg-green-50' },
    { value: 'medium', label: 'Medium Priority', icon: Flag, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { value: 'high', label: 'High Priority', icon: AlertCircle, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { value: 'urgent', label: 'Urgent', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' }
  ];

  const handleSubmit = () => {
    onUpdatePriority(task.id, selectedPriority);
    toast.success(`Task priority updated to ${selectedPriority}`);
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Set Task Priority</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{task.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Select the priority level for this task</p>
          </div>

          <div className="space-y-3">
            {priorities.map((priority) => {
              const Icon = priority.icon;
              return (
                <label
                  key={priority.value}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPriority === priority.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={selectedPriority === priority.value}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-lg ${priority.bgColor} mr-3`}>
                    <Icon className={`w-5 h-5 ${priority.color}`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{priority.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {priority.value === 'low' && 'Can be completed when time permits'}
                      {priority.value === 'medium' && 'Standard priority for regular tasks'}
                      {priority.value === 'high' && 'Important task requiring attention'}
                      {priority.value === 'urgent' && 'Critical task requiring immediate action'}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Priority
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskPriorityModal;
