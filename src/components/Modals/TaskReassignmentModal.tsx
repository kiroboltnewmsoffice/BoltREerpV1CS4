import React, { useState } from 'react';
import { X, Users, User, Search } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface TaskReassignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onReassignTask: (taskId: string, assigneeId: string, assigneeName: string) => void;
}

const TaskReassignmentModal: React.FC<TaskReassignmentModalProps> = ({ 
  isOpen, 
  onClose, 
  task,
  onReassignTask 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample team members - in real app, this would come from props or API
  const teamMembers = [
    { id: '1', name: 'John Smith', role: 'Project Manager', avatar: null },
    { id: '2', name: 'Sarah Johnson', role: 'Developer', avatar: null },
    { id: '3', name: 'Mike Wilson', role: 'Designer', avatar: null },
    { id: '4', name: 'Lisa Brown', role: 'QA Engineer', avatar: null },
    { id: '5', name: 'David Lee', role: 'Business Analyst', avatar: null },
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    const assignee = teamMembers.find(m => m.id === selectedAssignee);
    if (assignee) {
      onReassignTask(task.id, assignee.id, assignee.name);
      toast.success(`Task reassigned to ${assignee.name}`);
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reassign Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{task.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Currently assigned to: {task.assignee || 'Unassigned'}
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Team Members List */}
          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <label
                key={member.id}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAssignee === member.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="assignee"
                  value={member.id}
                  checked={selectedAssignee === member.id}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="sr-only"
                />
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{member.role}</div>
                </div>
              </label>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No team members found</p>
            </div>
          )}
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
            disabled={!selectedAssignee}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reassign Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskReassignmentModal;
