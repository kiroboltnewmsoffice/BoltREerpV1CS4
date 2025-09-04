import React, { useState } from 'react';
import {
  Bell,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  User,
  Eye,
  Trash2
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import StatsCard from '../../components/Dashboard/StatsCard';
import { format } from 'date-fns';

const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead } = useDataStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');

  // Filter notifications for current user
  const userNotifications = notifications.filter(n => n.userId === user?.id);
  
  const filteredNotifications = userNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    const matchesRead = readFilter === 'all' || 
                       (readFilter === 'unread' && !notification.read) ||
                       (readFilter === 'read' && notification.read);
    return matchesSearch && matchesType && matchesPriority && matchesRead;
  });

  // Calculate stats
  const totalNotifications = userNotifications.length;
  const unreadNotifications = userNotifications.filter(n => !n.read).length;
  const highPriorityNotifications = userNotifications.filter(n => n.priority === 'high' && !n.read).length;
  const actionRequiredNotifications = userNotifications.filter(n => n.actionRequired && !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment_reminder': return 'bg-green-100 text-green-800';
      case 'cheque_due': return 'bg-yellow-100 text-yellow-800';
      case 'follow_up': return 'bg-blue-100 text-blue-800';
      case 'task': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment_reminder': return DollarSign;
      case 'cheque_due': return CreditCard;
      case 'follow_up': return User;
      case 'task': return CheckCircle;
      case 'system': return Info;
      default: return Bell;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return AlertTriangle;
      case 'high': return AlertTriangle;
      case 'medium': return Info;
      case 'low': return CheckCircle;
      default: return Info;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated with important alerts and reminders</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              userNotifications.forEach(n => {
                if (!n.read) markNotificationRead(n.id);
              });
              toast.success('All notifications marked as read!');
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            type="button"
          >
            Mark All Read
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all notifications?')) {
                toast.success('All notifications cleared!');
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            type="button"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Notifications"
          value={totalNotifications}
          change="All time"
          changeType="neutral"
          icon={Bell}
          color="blue"
        />
        <StatsCard
          title="Unread"
          value={unreadNotifications}
          change="Require attention"
          changeType="neutral"
          icon={Eye}
          color="yellow"
        />
        <StatsCard
          title="High Priority"
          value={highPriorityNotifications}
          change="Urgent items"
          changeType="negative"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Action Required"
          value={actionRequiredNotifications}
          change="Need response"
          changeType="neutral"
          icon={Clock}
          color="purple"
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
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="payment_reminder">Payment Reminders</option>
              <option value="cheque_due">Cheque Due</option>
              <option value="follow_up">Follow-ups</option>
              <option value="task">Tasks</option>
              <option value="system">System</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications ({filteredNotifications.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredNotifications.map((notification) => {
            const TypeIcon = getTypeIcon(notification.type);
            const PriorityIcon = getPriorityIcon(notification.priority);
            
            return (
              <div 
                key={notification.id} 
                className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
                onClick={() => markNotificationRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.priority === 'critical' ? 'bg-red-100' :
                        notification.priority === 'high' ? 'bg-orange-100' :
                        notification.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <TypeIcon className={`h-5 w-5 ${
                          notification.priority === 'critical' ? 'text-red-600' :
                          notification.priority === 'high' ? 'text-orange-600' :
                          notification.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className={`text-lg font-semibold ${
                          notification.read 
                            ? 'text-gray-600 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                          {notification.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                          {notification.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{notification.message}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                        {notification.scheduledFor && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Scheduled: {format(new Date(notification.scheduledFor), 'MMM dd, yyyy')}
                          </div>
                        )}
                        {notification.actionRequired && (
                          <div className="flex items-center text-orange-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Action Required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {notification.actionUrl && (
                      <button 
                        onClick={() => toast.info(`Opening: ${notification.title}`)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        type="button"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (window.confirm('Delete this notification?')) {
                          toast.success('Notification deleted!');
                        }
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No notifications found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You're all caught up! Check back later for new updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;