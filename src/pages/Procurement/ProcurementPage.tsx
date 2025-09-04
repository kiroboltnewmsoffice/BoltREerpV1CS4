import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Package,
  Plus,
  Search,
  Filter,
  Truck,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Download
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import AddSupplierModal from '../../components/Modals/AddSupplierModal';
import AddPurchaseOrderModal from '../../components/Modals/AddPurchaseOrderModal';
import { formatCurrency } from '../../utils/currency';

const ProcurementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddPurchaseOrderModal, setShowAddPurchaseOrderModal] = useState(false);

  // Sample suppliers data
  const suppliers = [
    {
      id: '1',
      name: 'Cairo Construction Materials',
      email: 'info@cairoconstruction.com',
      phone: '+20-2-123-4567',
      address: '10th of Ramadan City, Cairo',
      category: 'Construction Materials',
      status: 'active' as const,
      rating: 4.8,
      totalOrders: 45,
      totalSpent: 2500000,
      paymentTerms: '30 days',
      contactPerson: 'Ahmed Farouk'
    },
    {
      id: '2',
      name: 'Egyptian Steel Company',
      email: 'sales@egyptiansteel.com',
      phone: '+20-2-987-6543',
      address: 'Helwan, Cairo',
      category: 'Steel & Metal',
      status: 'active' as const,
      rating: 4.5,
      totalOrders: 28,
      totalSpent: 1800000,
      paymentTerms: '45 days',
      contactPerson: 'Mohamed Hassan'
    }
  ];

  // Sample purchase orders
  const purchaseOrders = [
    {
      id: '1',
      orderNumber: 'PO-2024-001',
      supplierId: '1',
      supplierName: 'Cairo Construction Materials',
      items: [
        { id: '1', description: 'Cement bags (50kg)', quantity: 500, unitPrice: 180, totalPrice: 90000 },
        { id: '2', description: 'Steel rebar (12mm)', quantity: 100, unitPrice: 850, totalPrice: 85000 }
      ],
      totalAmount: 175000,
      status: 'confirmed' as const,
      orderDate: '2024-01-20',
      expectedDelivery: '2024-01-27',
      notes: 'Urgent delivery required for foundation work'
    },
    {
      id: '2',
      orderNumber: 'PO-2024-002',
      supplierId: '2',
      supplierName: 'Egyptian Steel Company',
      items: [
        { id: '1', description: 'Structural steel beams', quantity: 50, unitPrice: 2500, totalPrice: 125000 }
      ],
      totalAmount: 125000,
      status: 'sent' as const,
      orderDate: '2024-01-22',
      expectedDelivery: '2024-02-05',
      notes: 'Quality inspection required upon delivery'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'confirmed': return CheckCircle;
      case 'sent': return Clock;
      case 'draft': return Package;
      case 'cancelled': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Procurement Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage suppliers, purchase orders, and procurement processes</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              const csvData = suppliers.map(s => ({
                'Supplier Name': s.name,
                'Category': s.category,
                'Rating': s.rating,
                'Total Orders': s.totalOrders,
                'Total Spent': s.totalSpent,
                'Payment Terms': s.paymentTerms,
                'Contact Person': s.contactPerson,
                'Status': s.status
              }));
              
              const csvContent = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `suppliers-report-${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              toast.success('Suppliers data exported successfully!');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Export Suppliers
          </button>
          <button 
            onClick={() => {
              setShowAddSupplierModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </button>
          <button 
            onClick={() => {
              setShowAddPurchaseOrderModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            type="button"
          >
            <Package className="h-4 w-4 mr-2" />
            New Purchase Order
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Suppliers"
          value={suppliers.filter(s => s.status === 'active').length}
          change="Verified vendors"
          changeType="positive"
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Total Spent"
          value={`EGP ${(suppliers.reduce((sum, s) => sum + s.totalSpent, 0) / 1000000).toFixed(1)}M`}
          change="This year"
          changeType="neutral"
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Pending Orders"
          value={purchaseOrders.filter(po => po.status === 'sent').length}
          change="Awaiting delivery"
          changeType="neutral"
          icon={Truck}
          color="yellow"
        />
        <StatsCard
          title="Average Rating"
          value={(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
          change="Supplier quality"
          changeType="positive"
          icon={CheckCircle}
          color="purple"
        />
      </div>

      {/* Purchase Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Purchase Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Delivery
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
              {purchaseOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.items.length} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{order.supplierName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.orderDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.totalAmount.toLocaleString()} EGP
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{order.expectedDelivery}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="h-4 w-4 mr-2" />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          type="button"
                          onClick={() => toast(`Viewing purchase order: ${order.orderNumber}`)}
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-green-600 transition-colors">
                          type="button"
                          onClick={() => toast(`Edit purchase order modal would open for: ${order.orderNumber}`)}
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-purple-600 transition-colors">
                          type="button"
                          onClick={() => toast.success(`Downloading purchase order: ${order.orderNumber}`)}
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Suppliers</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{supplier.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.category}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{supplier.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Total Orders:</span>
                    <span className="text-gray-900 dark:text-white">{supplier.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Total Spent:</span>
                    <span className="text-gray-900 dark:text-white">EGP {supplier.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Payment Terms:</span>
                    <span className="text-gray-900 dark:text-white">{supplier.paymentTerms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Contact:</span>
                    <span className="text-gray-900 dark:text-white">{supplier.contactPerson}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => toast.success(`Creating order for ${supplier.name}`)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    type="button"
                  >
                    Create Order
                  </button>
                  <button 
                    onClick={() => toast(`Viewing details for ${supplier.name}`)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => toast(`Editing ${supplier.name}`)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    type="button"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <AddSupplierModal 
        isOpen={showAddSupplierModal} 
        onClose={() => setShowAddSupplierModal(false)} 
      />
      
      <AddPurchaseOrderModal 
        isOpen={showAddPurchaseOrderModal} 
        onClose={() => setShowAddPurchaseOrderModal(false)} 
      />
    </div>
  );
};

export default ProcurementPage;