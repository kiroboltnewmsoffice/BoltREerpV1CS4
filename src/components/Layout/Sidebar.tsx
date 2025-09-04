import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Building,
  DollarSign,
  FileText,
  Bell,
  Settings,
  CreditCard,
  BarChart3,
  CheckSquare,
  UserCog,
  Briefcase,
  Package,
  Truck,
  Calendar,
  Target,
  TrendingUp,
  Shield,
  FileCheck,
  MessageSquare,
  Wrench,
  Archive,
  Clock,
  Receipt,
  PieChart,
  Workflow
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const { user, hasPermission } = useAuthStore();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', permission: 'dashboard' },
    { path: '/crm', icon: Users, label: 'CRM', permission: 'crm' },
    { path: '/properties', icon: Building, label: 'Properties', permission: 'properties' },
    { path: '/accounting', icon: DollarSign, label: 'Accounting', permission: 'accounting' },
    { path: '/cheques', icon: CreditCard, label: 'Cheques', permission: 'cheques' },
    { path: '/contracts', icon: FileText, label: 'Contracts', permission: 'contracts' },
    { path: '/invoices', icon: Receipt, label: 'Invoices', permission: 'invoices' },
    { path: '/projects', icon: Briefcase, label: 'Projects', permission: 'projects' },
    { path: '/hr', icon: Users, label: 'Human Resources', permission: 'hr' },
    { path: '/procurement', icon: Package, label: 'Procurement', permission: 'procurement' },
    { path: '/inventory', icon: Archive, label: 'Inventory', permission: 'inventory' },
    { path: '/maintenance', icon: Wrench, label: 'Maintenance', permission: 'maintenance' },
    { path: '/marketing', icon: Target, label: 'Marketing', permission: 'marketing' },
    { path: '/communications', icon: MessageSquare, label: 'Communications', permission: 'communications' },
    { path: '/appointments', icon: Calendar, label: 'Appointments', permission: 'appointments' },
    { path: '/assets', icon: Shield, label: 'Asset Management', permission: 'assets' },
    { path: '/workflows', icon: Workflow, label: 'Workflows', permission: 'workflows' },
    { path: '/audit', icon: FileCheck, label: 'Audit Trail', permission: 'audit' },
    { path: '/reports', icon: BarChart3, label: 'Reports', permission: 'reports' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks', permission: 'tasks' },
    { path: '/notifications', icon: Bell, label: 'Notifications', permission: 'notifications' },
    { path: '/users', icon: UserCog, label: 'Users', permission: 'users' },
    { path: '/settings', icon: Settings, label: 'Settings', permission: 'settings' }
  ];

  const visibleItems = menuItems.filter(item => 
    hasPermission(item.permission, 'read') || user?.role === 'super_admin'
  );

  return (
    <div className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center">
          <Building className="h-8 w-8 text-blue-600 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
              RealEstate ERP
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <div className="px-3 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3 whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-white">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.role.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;