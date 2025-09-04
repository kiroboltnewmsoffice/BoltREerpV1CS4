import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import StatsCard from '../../components/Dashboard/StatsCard';
import CreateTaskModal from '../../components/Modals/CreateTaskModal';
import ViewTaskModal from '../../components/Modals/ViewTaskModal';
import EditTaskModal from '../../components/Modals/EditTaskModal';
import DropdownMenu from '../../components/DropdownMenu';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Task } from '../../types';

const TasksPage: React.FC = () => {
  const { tasks, updateTask } = useDataStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || 
                           (assigneeFilter === 'me' && task.assignedTo === user?.id) ||
                           task.assignedTo === assigneeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  // Calculate stats
  const totalTasks = tasks.length;
  const myTasks = tasks.filter(t => t.assignedTo === user?.id).length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => 
    t.status !== 'completed' && isBefore(new Date(t.dueDate), new Date())
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isTaskOverdue = (dueDate: string, status: string) => {
    return status !== 'completed' && isBefore(new Date(dueDate), new Date());
  };

  const isTaskDueSoon = (dueDate: string, status: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const threeDaysFromNow = addDays(today, 3);
    return status !== 'completed' && isAfter(due, today) && isBefore(due, threeDaysFromNow);
  };

  // Transform Task for modal
  const transformTaskForModal = (task: Task) => {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      assignee: task.assignedTo, // Map assignedTo to assignee
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      createdDate: task.createdAt, // Map createdAt to createdDate
      project: task.category, // Map category to project  
      tags: [], // Default empty array
      estimatedHours: 8, // Default value
      actualHours: 0, // Default value
      progress: task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0
    };
  };

  // Modal handlers
  const handleViewTask = (task: Task) => {
    const transformedTask = transformTaskForModal(task);
    setSelectedTask(transformedTask);
    setShowViewModal(true);
  };

  const handleEditTask = (task: Task) => {
    const transformedTask = transformTaskForModal(task);
    setSelectedTask(transformedTask);
    setShowEditModal(true);
  };

  const handleUpdateTask = (updatedModalTask: any) => {
    if (!selectedTask) return;
    
    // Transform back to original Task format
    const updatedTask: Partial<Task> = {
      title: updatedModalTask.title,
      description: updatedModalTask.description,
      assignedTo: updatedModalTask.assignee,
      priority: updatedModalTask.priority,
      status: updatedModalTask.status,
      dueDate: updatedModalTask.dueDate,
      category: updatedModalTask.project || 'General'
    };
    
    updateTask(updatedModalTask.id, updatedTask);
  };

  const handleMoreTaskOptions = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const options = [
        {
          label: 'Duplicate Task',
          onClick: () => {
            toast.success(`Duplicating task "${task.title}"`);
            // TODO: Implement task duplication
          }
        },
        {
          label: 'Change Priority',
          onClick: () => {
            toast.success(`Opening priority selector for "${task.title}"`);
            // TODO: Open priority modal
          }
        },
        {
          label: 'Reassign Task',
          onClick: () => {
            toast.success(`Opening assignment for "${task.title}"`);
            // TODO: Open reassignment modal
          }
        },
        {
          label: 'Add Subtask',
          onClick: () => {
            toast.success(`Adding subtask to "${task.title}"`);
            // TODO: Open subtask modal
          }
        },
        {
          label: 'Set Reminder',
          onClick: () => {
            toast.success(`Setting reminder for "${task.title}"`);
            // TODO: Open reminder modal
          }
        },
        {
          label: 'Task History',
          onClick: () => {
            toast.success(`Opening history for "${task.title}"`);
            // TODO: Open history modal
          }
        },
        {
          label: 'Archive Task',
          onClick: () => {
            toast.success(`Archiving "${task.title}"`);
            // TODO: Archive task
          }
        }
      ];
      
      return options;
    }
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Organize and track team tasks and deadlines</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          change={`${myTasks} assigned to you`}
          changeType="neutral"
          icon={CheckSquare}
          color="blue"
        />
        <StatsCard
          title="Pending"
          value={pendingTasks}
          change="Awaiting action"
          changeType="neutral"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Completed"
          value={completedTasks}
          change={`${((completedTasks / totalTasks) * 100).toFixed(1)}% completion rate`}
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Overdue"
          value={overdueTasks}
          change="Require attention"
          changeType="negative"
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Assignees</option>
              <option value="me">My Tasks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tasks ({filteredTasks.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTasks.map((task) => {
            const isOverdue = isTaskOverdue(task.dueDate, task.status);
            const isDueSoon = isTaskDueSoon(task.dueDate, task.status);
            
            return (
              <div key={task.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <button
                      onClick={() => updateTask(task.id, { 
                        status: task.status === 'completed' ? 'pending' : 'completed',
                        completedAt: task.status === 'completed' ? undefined : new Date().toISOString()
                      })}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 transition-colors ${
                        task.status === 'completed' 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {task.status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className={`text-lg font-semibold ${
                          task.status === 'completed' 
                            ? 'text-gray-500 dark:text-gray-400 line-through' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Assigned to: {task.assignedTo === user?.id ? 'You' : 'Team Member'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className={`${
                            isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : ''
                          }`}>
                            Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400">Category:</span>
                          <span className="ml-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                            {task.category}
                          </span>
                        </div>
                      </div>
                      
                      {(isOverdue || isDueSoon) && (
                        <div className={`mt-2 flex items-center text-sm ${
                          isOverdue ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {isOverdue ? 'Task is overdue' : 'Task due soon'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={() => handleViewTask(task)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditTask(task)}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      type="button"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <DropdownMenu
                      options={handleMoreTaskOptions(task.id)}
                      buttonClassName="text-gray-400 hover:text-gray-600 transition-colors"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="p-12 text-center">
            <CheckSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search criteria or create a new task.</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              type="button"
            >
              Create New Task
            </button>
          </div>
        )}
      </div>
      
      <CreateTaskModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      
      <ViewTaskModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        task={selectedTask}
      />
      
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={selectedTask}
        onSave={handleUpdateTask}
      />
    </div>
  );
};

export default TasksPage;