import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import StatsCard from '../../components/Dashboard/StatsCard';
import AddCustomerModal from '../../components/Modals/AddCustomerModal';
import ViewCustomerModal from '../../components/Modals/ViewCustomerModal';
import EditCustomerModal from '../../components/Modals/EditCustomerModal';
import { formatCurrency } from '../../utils/currency';

const CRMDashboard: React.FC = () => {
  const { customers } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'customer').length;
  const leads = customers.filter(c => c.status === 'lead').length;
  const prospects = customers.filter(c => c.status === 'prospect').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'corporate' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const handleAddCustomer = () => {
    setShowAddModal(true);
  };

  const handleViewCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setShowViewModal(true);
    }
  };

  const handleEditCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setShowEditModal(true);
    }
  };

  const handleMoreOptions = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const options = [
        'Send Email',
        'Schedule Call',
        'Add Note',
        'View History',
        'Export Data',
        'Merge Customer',
        'Archive Customer'
      ];
      const selectedOption = window.prompt(`Select an option for ${customer.name}:\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`);
      if (selectedOption) {
        toast.success(`${options[parseInt(selectedOption) - 1] || 'Option'} selected for ${customer.name}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Relationship Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage leads, prospects, and customers</p>
        </div>
        <button 
          onClick={handleAddCustomer}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          type="button"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Customers"
          value={totalCustomers}
          change="+12% this month"
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Active Customers"
          value={activeCustomers}
          change={`${((activeCustomers / totalCustomers) * 100).toFixed(1)}% conversion`}
          changeType="positive"
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Prospects"
          value={prospects}
          change="Ready to convert"
          changeType="neutral"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="New Leads"
          value={leads}
          change="This week"
          changeType="neutral"
          icon={UserPlus}
          color="yellow"
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
                placeholder="Search customers..."
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
              <option value="lead">Leads</option>
              <option value="prospect">Prospects</option>
              <option value="customer">Customers</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button 
              onClick={() => console.log('Filter options clicked')}
              className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              type="button"
            >
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Customers ({filteredCustomers.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {customer.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(customer.type)}`}>
                        {customer.type.charAt(0).toUpperCase() + customer.type.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {customer.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {customer.address}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 mr-1" />
                        Last Contact: {customer.lastContact || 'Never'}
                      </div>
                      {customer.totalSpent > 0 && (
                        <div className="flex items-center text-green-600">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Total: {formatCurrency(customer.totalSpent)}
                        </div>
                      )}
                    </div>
                    
                    {customer.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {customer.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewCustomer(customer.id)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEditCustomer(customer.id)}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                    type="button"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleMoreOptions(customer.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    type="button"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No customers found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search criteria or add a new customer.</p>
            <button 
              onClick={handleAddCustomer}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              type="button"
            >
              Add New Customer
            </button>
          </div>
        )}
      </div>
      
      <AddCustomerModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <ViewCustomerModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        customer={selectedCustomer}
      />
      
      <EditCustomerModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CRMDashboard;