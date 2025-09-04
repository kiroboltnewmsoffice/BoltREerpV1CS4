import React from 'react';
import { X, Calendar, User, Flag, Clock, FileText, MessageSquare } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { format } from 'date-fns';

interface TaskHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
}

const TaskHistoryModal: React.FC<TaskHistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  task
}) => {
  useEscapeKey(isOpen, onClose);

  // Sample history data - in real app, this would come from props or API
  const historyItems = [
    {
      id: '1',
      action: 'Task Created',
      description: 'Task was created and assigned',
      user: 'John Smith',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      type: 'created',
      icon: FileText
    },
    {
      id: '2',
      action: 'Priority Changed',
      description: 'Priority changed from Medium to High',
      user: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      type: 'priority',
      icon: Flag
    },
    {
      id: '3',
      action: 'Comment Added',
      description: 'Added progress update comment',
      user: 'Mike Wilson',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'comment',
      icon: MessageSquare
    },
    {
      id: '4',
      action: 'Assignee Changed',
      description: 'Task reassigned from John Smith to Sarah Johnson',
      user: 'John Smith',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      type: 'assignee',
      icon: User
    },
    {
      id: '5',
      action: 'Due Date Extended',
      description: 'Due date extended by 2 days',
      user: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      type: 'duedate',
      icon: Calendar
    },
    {
      id: '6',
      action: 'Status Updated',
      description: 'Status changed to In Progress',
      user: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      type: 'status',
      icon: Clock
    }
  ];

  const getActionColor = (type: string) => {
    switch (type) {
      case 'created': return 'text-green-600 bg-green-50';
      case 'priority': return 'text-orange-600 bg-orange-50';
      case 'comment': return 'text-blue-600 bg-blue-50';
      case 'assignee': return 'text-purple-600 bg-purple-50';
      case 'duedate': return 'text-yellow-600 bg-yellow-50';
      case 'status': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{task.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete timeline of all changes and activities
            </p>
          </div>

          <div className="space-y-4">
            {historyItems.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === historyItems.length - 1;
              
              return (
                <div key={item.id} className="relative">
                  {/* Timeline line */}
                  {!isLast && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200 dark:bg-gray-700"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getActionColor(item.type)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.action}</h4>
                        <time className="text-sm text-gray-500 dark:text-gray-400">
                          {format(item.timestamp, 'MMM d, yyyy HH:mm')}
                        </time>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          by {item.user}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {historyItems.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No history available for this task</p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskHistoryModal;
