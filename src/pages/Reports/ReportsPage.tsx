import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Building,
  FileText,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useDataStore } from '../../store/dataStore';
import StatsCard from '../../components/Dashboard/StatsCard';
import toast from 'react-hot-toast';
import GenerateReportModal from '../../components/Modals/GenerateReportModal';
import { formatCurrency } from '../../utils/currency';

const ReportsPage: React.FC = () => {
  const { transactions, customers, properties, units } = useDataStore();
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Calculate revenue data
  const revenueData = [
    { month: 'Jan', revenue: 850000, transactions: 12 },
    { month: 'Feb', revenue: 1200000, transactions: 19 },
    { month: 'Mar', revenue: 600000, transactions: 8 },
    { month: 'Apr', revenue: 950000, transactions: 15 },
    { month: 'May', revenue: 1400000, transactions: 22 },
    { month: 'Jun', revenue: 1100000, transactions: 18 }
  ];

  // Sales by property type
  const propertyTypeData = [
    { name: 'Residential', value: 75, amount: 2850000, color: '#3B82F6' },
    { name: 'Commercial', value: 25, amount: 950000, color: '#10B981' }
  ];

  // Payment method distribution
  const paymentMethodData = [
    { method: 'Cheque', percentage: 65, amount: 2470000 },
    { method: 'Bank Transfer', percentage: 25, amount: 950000 },
    { method: 'Cash', percentage: 8, amount: 304000 },
    { method: 'InstaPay', percentage: 2, amount: 76000 }
  ];

  // Customer acquisition data
  const customerData = [
    { month: 'Jan', leads: 45, prospects: 28, customers: 12 },
    { month: 'Feb', leads: 52, prospects: 35, customers: 19 },
    { month: 'Mar', leads: 38, prospects: 22, customers: 8 },
    { month: 'Apr', leads: 48, prospects: 30, customers: 15 },
    { month: 'May', leads: 65, prospects: 42, customers: 22 },
    { month: 'Jun', leads: 58, prospects: 38, customers: 18 }
  ];

  // Calculate summary stats
  const totalRevenue = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalCustomers = customers.length;
  const totalProperties = properties.length;
  const totalUnits = units.length;

  const renderRevenueReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`AED ${(Number(value) / 1000).toFixed(0)}K`, 'Revenue']} />
              <Tooltip formatter={(value) => [`EGP ${(Number(value) / 1000).toFixed(0)}K`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Property Type</h3>
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={paymentMethodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="method" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
            <Bar dataKey="percentage" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Acquisition Funnel</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={customerData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="leads" fill="#EF4444" name="Leads" />
            <Bar dataKey="prospects" fill="#F59E0B" name="Prospects" />
            <Bar dataKey="customers" fill="#10B981" name="Customers" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Business intelligence and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              const reportData = {
                reportType,
                dateRange,
                generatedAt: new Date().toISOString(),
                totalRevenue,
                totalCustomers,
                totalProperties,
                totalUnits
              };
              
              const csvContent = [
                'Report Type,Date Range,Generated At,Total Revenue,Total Customers,Total Properties,Total Units',
                `${reportType},${dateRange},${reportData.generatedAt},${totalRevenue},${totalCustomers},${totalProperties},${totalUnits}`
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              toast.success('Report exported successfully!');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            type="button"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            type="button"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`${(totalRevenue / 1000000).toFixed(1)}M EGP`}
          change="+15% from last month"
          changeType="positive"
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Total Customers"
          value={totalCustomers}
          change="+12% growth"
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Properties"
          value={totalProperties}
          change={`${totalUnits} total units`}
          changeType="neutral"
          icon={Building}
          color="purple"
        />
        <StatsCard
          title="Conversion Rate"
          value="18.5%"
          change="Lead to customer"
          changeType="positive"
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Report Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="revenue">Revenue Report</option>
              <option value="sales">Sales Report</option>
              <option value="customer">Customer Report</option>
              <option value="property">Property Report</option>
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {reportType === 'revenue' && renderRevenueReport()}
      {reportType === 'sales' && renderSalesReport()}
      
      {reportType === 'customer' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Customer Status Distribution</h4>
              <div className="space-y-2">
                {['lead', 'prospect', 'customer', 'inactive'].map(status => {
                  const count = customers.filter(c => c.status === status).length;
                  const percentage = (count / customers.length) * 100;
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Customer Value Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Customer Value</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString()} EGP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Highest Value Customer</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.max(...customers.map(c => c.totalSpent)).toLocaleString()} EGP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Customers</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {customers.filter(c => c.status === 'customer').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'property' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Property Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map(property => (
              <div key={property.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">{property.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Units</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{property.totalUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sold</span>
                    <span className="text-sm font-medium text-green-600">{property.soldUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                    <span className="text-sm font-medium text-blue-600">{property.availableUnits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sales Rate</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {((property.soldUnits / property.totalUnits) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(property.soldUnits / property.totalUnits) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <GenerateReportModal 
        isOpen={showGenerateModal} 
        onClose={() => setShowGenerateModal(false)} 
      />
    </div>
  );
};

export default ReportsPage;