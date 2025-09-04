import React, { useState } from 'react';
import {
  UserCog,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import StatsCard from '../../components/Dashboard/StatsCard';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import AddUserModal from '../../components/Modals/AddUserModal';
import ViewUserModal from '../../components/Modals/ViewUserModal';

const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Sample users data (expanded)
  const users = [
    {
      id: '1',
      name: 'John Anderson',
      email: 'admin@realestate.com',
      role: 'super_admin',
      department: 'Administration',
      isActive: true,
      createdAt: '2024-01-01',
      lastLogin: '2024-01-25',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'finance@realestate.com',
      role: 'finance_manager',
      department: 'Finance',
      isActive: true,
      createdAt: '2024-01-01',
      lastLogin: '2024-01-24',
      permissions: ['accounting', 'reports', 'cheques']
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'sales@realestate.com',
      role: 'sales_manager',
      department: 'Sales',
      isActive: true,
      createdAt: '2024-01-01',
      lastLogin: '2024-01-25',
      permissions: ['crm', 'properties', 'contracts']
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'accountant@realestate.com',
      role: 'accountant',
      department: 'Finance',
      isActive: true,
      createdAt: '2024-01-05',
      lastLogin: '2024-01-23',
      permissions: ['accounting', 'transactions']
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'sales.rep@realestate.com',
      role: 'sales_representative',
      department: 'Sales',
      isActive: true,
      createdAt: '2024-01-10',
      lastLogin: '2024-01-25',
      permissions: ['crm']
    },
    {
      id: '6',
      name: 'Lisa Garcia',
      email: 'support@realestate.com',
      role: 'customer_service',
      department: 'Customer Service',
      isActive: false,
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20',
      permissions: ['crm', 'notifications']
    }
  ];

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const inactiveUsers = users.filter(u => !u.isActive).length;
  const adminUsers = users.filter(u => u.role.includes('admin') || u.role.includes('manager')).length;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'finance_manager': return 'bg-green-100 text-green-800';
      case 'sales_manager': return 'bg-blue-100 text-blue-800';
      case 'accountant': return 'bg-purple-100 text-purple-800';
      case 'sales_representative': return 'bg-yellow-100 text-yellow-800';
      case 'customer_service': return 'bg-indigo-100 text-indigo-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage system users and permissions</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          change="System users"
          changeType="neutral"
          icon={UserCog}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={activeUsers}
          change={`${((activeUsers / totalUsers) * 100).toFixed(1)}% active`}
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Inactive Users"
          value={inactiveUsers}
          change="Disabled accounts"
          changeType="neutral"
          icon={XCircle}
          color="red"
        />
        <StatsCard
          title="Admin Users"
          value={adminUsers}
          change="Management level"
          changeType="neutral"
          icon={Shield}
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="finance_manager">Finance Manager</option>
              <option value="sales_manager">Sales Manager</option>
              <option value="accountant">Accountant</option>
              <option value="sales_representative">Sales Representative</option>
              <option value="customer_service">Customer Service</option>
              <option value="viewer">Viewer</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Users ({filteredUsers.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                          {user.id === currentUser?.id && (
                            <span className="ml-2 text-xs text-blue-600">(You)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {formatRole(user.role)}
                      </span>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {user.department}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center mb-1">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {format(new Date(user.lastLogin), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(user.lastLogin), 'HH:mm')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.isActive ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm text-red-600">Inactive</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowViewModal(true);
                        }}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        type="button"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => toast.success(`Edit functionality for user: ${user.name}`)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        type="button"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const options = [
                            'Reset Password',
                            'Change Permissions',
                            'View Activity Log',
                            'Send Notification',
                            'Export User Data',
                            'Suspend Account',
                            'Delete User'
                          ];
                          const selectedOption = window.prompt(`Select an option for ${user.name}:\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`);
                          if (selectedOption) {
                            toast.success(`${options[parseInt(selectedOption) - 1] || 'Option'} selected for ${user.name}`);
                          }
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <AddUserModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <ViewUserModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersPage;