import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  Calendar,
  User,
  Activity,
  Shield,
  Eye,
  Download,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import toast from 'react-hot-toast';

const AuditPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  // Sample audit trail data
  const auditLogs = [
    {
      id: '1',
      action: 'CREATE',
      module: 'CRM',
      entityId: '1',
      entityType: 'Customer',
      userId: '3',
      userName: 'Mike Wilson',
      timestamp: '2024-01-25T10:30:00',
      details: { customerName: 'Ahmed Hassan', email: 'ahmed@email.com' },
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      action: 'UPDATE',
      module: 'Accounting',
      entityId: '1',
      entityType: 'Transaction',
      userId: '2',
      userName: 'Sarah Johnson',
      timestamp: '2024-01-25T14:15:00',
      details: { transactionId: 'TXN001', amount: 255000, status: 'completed' },
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      action: 'DELETE',
      module: 'Properties',
      entityId: '5',
      entityType: 'Unit',
      userId: '1',
      userName: 'John Anderson',
      timestamp: '2024-01-24T16:45:00',
      details: { unitNumber: 'A-1205', reason: 'Duplicate entry' },
      ipAddress: '192.168.1.102'
    },
    {
      id: '4',
      action: 'LOGIN',
      module: 'System',
      entityId: '2',
      entityType: 'User',
      userId: '2',
      userName: 'Sarah Johnson',
      timestamp: '2024-01-25T09:00:00',
      details: { loginMethod: 'email_password' },
      ipAddress: '192.168.1.101'
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.entityType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    const matchesUser = userFilter === 'all' || log.userId === userFilter;
    return matchesSearch && matchesModule && matchesUser;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'LOGIN': return 'bg-purple-100 text-purple-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'CRM': return 'bg-blue-100 text-blue-800';
      case 'Accounting': return 'bg-green-100 text-green-800';
      case 'Properties': return 'bg-purple-100 text-purple-800';
      case 'System': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalLogs = auditLogs.length;
  const todayLogs = auditLogs.filter(log => 
    new Date(log.timestamp).toDateString() === new Date().toDateString()
  ).length;
  const uniqueUsers = new Set(auditLogs.map(log => log.userId)).size;
  const criticalActions = auditLogs.filter(log => log.action === 'DELETE').length;

  const handleMoreAuditOptions = (logId: string) => {
    const log = auditLogs.find(l => l.id === logId);
    if (log) {
      const options = [
        'View Full Details',
        'Export Log Entry',
        'Related Activities',
        'User Activity Report',
        'Flag for Review',
        'Add Investigation Note'
      ];
      
      const optionsMenu = document.createElement('div');
      optionsMenu.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      optionsMenu.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audit Log Actions</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${log.action} on ${log.entityType}</p>
          <div class="space-y-2">
            ${options.map((opt, i) => `<button class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" data-action="${i}">${opt}</button>`).join('')}
          </div>
          <button class="w-full mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" data-action="close">Close</button>
        </div>
      `;
      
      document.body.appendChild(optionsMenu);
      
      optionsMenu.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const action = target.getAttribute('data-action');
        
        if (action) {
          document.body.removeChild(optionsMenu);
          
          if (action !== 'close') {
            const actionIndex = parseInt(action);
            toast.success(`${options[actionIndex]} selected for audit log`);
          }
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Trail</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor system activities and user actions</p>
        </div>
        <button 
          onClick={() => {
            const csvData = filteredLogs.map(log => ({
              'Action': log.action,
              'Module': log.module,
              'Entity Type': log.entityType,
              'Entity ID': log.entityId,
              'User': log.userName,
              'Timestamp': new Date(log.timestamp).toLocaleString(),
              'IP Address': log.ipAddress
            }));
            
            const csvContent = [
              Object.keys(csvData[0]).join(','),
              ...csvData.map(row => Object.values(row).join(','))
            ].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success('Audit log exported successfully!');
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          type="button"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Audit Log
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Activities"
          value={totalLogs}
          change="All time"
          changeType="neutral"
          icon={Activity}
          color="blue"
        />
        <StatsCard
          title="Today's Activities"
          value={todayLogs}
          change="Recent actions"
          changeType="neutral"
          icon={Clock}
          color="green"
        />
        <StatsCard
          title="Active Users"
          value={uniqueUsers}
          change="System users"
          changeType="neutral"
          icon={User}
          color="purple"
        />
        <StatsCard
          title="Critical Actions"
          value={criticalActions}
          change="Deletion activities"
          changeType="neutral"
          icon={Shield}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Modules</option>
              <option value="CRM">CRM</option>
              <option value="Accounting">Accounting</option>
              <option value="Properties">Properties</option>
              <option value="System">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Audit Logs ({filteredLogs.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Module & Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getModuleColor(log.module)} mr-2`}>
                        {log.module}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">{log.entityType}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {log.entityId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{log.userName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {log.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{log.ipAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleMoreAuditOptions(log.id)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      type="button"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditPage;