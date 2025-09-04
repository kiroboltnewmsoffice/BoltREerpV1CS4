import React from 'react';
import {
  Users,
  Building,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import StatsCard from '../components/Dashboard/StatsCard';
import { useDataStore } from '../store/dataStore';
import { useAuthStore } from '../store/authStore';
import { formatCurrency, formatCurrencyShort } from '../utils/currency';

const Dashboard: React.FC = () => {
  const { customers, properties, transactions, units, notifications, tasks } = useDataStore();
  const { user } = useAuthStore();

  // Calculate stats
  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayments = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeCustomers = customers.filter(c => c.status === 'customer').length;
  const availableUnits = units.filter(u => u.status === 'available').length;
  const soldUnits = units.filter(u => u.status === 'sold').length;
  
  const unreadNotifications = notifications.filter(n => !n.read && n.userId === user?.id).length;
  const pendingTasks = tasks.filter(t => t.status === 'pending' && t.assignedTo === user?.id).length;

  // Chart data
  const salesData = [
    { month: 'Jan', sales: 12, revenue: 2550000 },
    { month: 'Feb', sales: 19, revenue: 3600000 },
    { month: 'Mar', sales: 8, revenue: 1800000 },
    { month: 'Apr', sales: 15, revenue: 2850000 },
    { month: 'May', sales: 22, revenue: 4200000 },
    { month: 'Jun', sales: 18, revenue: 3300000 }
  ];

  const propertyTypeData = [
    { name: 'Residential', value: 75, color: '#3B82F6' },
    { name: 'Commercial', value: 25, color: '#10B981' }
  ];

  const paymentMethodData = [
    { method: 'Cheque', amount: 65 },
    { method: 'Bank Transfer', amount: 25 },
    { method: 'Cash', amount: 8 },
    { method: 'InstaPay', amount: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-blue-100 mt-1">Here's what's happening with your business today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrencyShort(totalRevenue)}
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Active Customers"
          value={activeCustomers}
          change="+5 new this week"
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Available Units"
          value={availableUnits}
          change={`${soldUnits} sold`}
          changeType="neutral"
          icon={Building}
          color="purple"
        />
        <StatsCard
          title="Pending Payments"
          value={formatCurrencyShort(pendingPayments)}
          change={`${transactions.filter(t => t.status === 'pending').length} pending`}
          changeType="neutral"
          icon={CreditCard}
          color="yellow"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Property Types */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Property Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {propertyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${(Number(value) / 1000).toFixed(0)}K EGP`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentMethodData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="method" type="category" width={80} />
              <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
              <Bar dataKey="amount" fill="#6366F1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    transaction.status === 'completed' ? 'bg-green-500' :
                    transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.customerName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.paymentMethod}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.transactionDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Tasks */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alerts</h3>
              {unreadNotifications > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.priority === 'high' ? 'bg-red-500' :
                    notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Tasks</h3>
              {pendingTasks > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {pendingTasks}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.assignedTo === user?.id).slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 ${
                    task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  } flex items-center justify-center`}>
                    {task.status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;