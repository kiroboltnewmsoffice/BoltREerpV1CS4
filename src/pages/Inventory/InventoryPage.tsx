import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Archive,
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Eye,
  Edit,
  BarChart3,
  MoreHorizontal
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import AddInventoryItemModal from '../../components/Modals/AddInventoryItemModal';
import { formatCurrency } from '../../utils/currency';

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample inventory data
  const inventory = [
    {
      id: '1',
      itemName: 'Cement (50kg bags)',
      category: 'Construction Materials',
      sku: 'CEM-50KG-001',
      quantity: 450,
      minStock: 100,
      maxStock: 1000,
      unitPrice: 180,
      supplier: 'Cairo Construction Materials',
      location: 'Warehouse A - Section 1',
      lastUpdated: '2024-01-25',
      status: 'in_stock' as const
    },
    {
      id: '2',
      itemName: 'Steel Rebar 12mm',
      category: 'Steel & Metal',
      sku: 'STL-12MM-002',
      quantity: 25,
      minStock: 50,
      maxStock: 200,
      unitPrice: 850,
      supplier: 'Egyptian Steel Company',
      location: 'Warehouse B - Section 2',
      lastUpdated: '2024-01-24',
      status: 'low_stock' as const
    },
    {
      id: '3',
      itemName: 'Ceramic Tiles (60x60)',
      category: 'Finishing Materials',
      sku: 'CER-60X60-003',
      quantity: 0,
      minStock: 20,
      maxStock: 500,
      unitPrice: 45,
      supplier: 'Egyptian Ceramics',
      location: 'Warehouse A - Section 3',
      lastUpdated: '2024-01-23',
      status: 'out_of_stock' as const
    },
    {
      id: '4',
      itemName: 'Paint (White - 20L)',
      category: 'Finishing Materials',
      sku: 'PNT-WHT-20L',
      quantity: 85,
      minStock: 30,
      maxStock: 150,
      unitPrice: 320,
      supplier: 'Cairo Paints',
      location: 'Warehouse A - Section 4',
      lastUpdated: '2024-01-25',
      status: 'in_stock' as const
    }
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockLevel = (quantity: number, minStock: number, maxStock: number) => {
    const percentage = (quantity / maxStock) * 100;
    if (quantity === 0) return { color: 'bg-red-500', level: 'Empty' };
    if (quantity <= minStock) return { color: 'bg-yellow-500', level: 'Low' };
    if (percentage >= 80) return { color: 'bg-green-500', level: 'High' };
    return { color: 'bg-blue-500', level: 'Normal' };
  };

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(i => i.status === 'low_stock').length;
  const outOfStockItems = inventory.filter(i => i.status === 'out_of_stock').length;
  const totalValue = inventory.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);

  const handleMoreInventoryOptions = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      const options = [
        'Adjust Stock',
        'Reorder Item',
        'Transfer Location',
        'Stock History',
        'Set Alerts',
        'Update Supplier',
        'Archive Item'
      ];
      
      const optionsMenu = document.createElement('div');
      optionsMenu.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      optionsMenu.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory Actions</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${item.itemName}</p>
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
            toast.success(`${options[actionIndex]} selected for ${item.itemName}`);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track stock levels, manage inventory, and monitor supplies</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              const csvData = filteredInventory.map(item => ({
                'Item Name': item.itemName,
                'SKU': item.sku,
                'Category': item.category,
                'Quantity': item.quantity,
                'Unit Price': item.unitPrice,
                'Total Value': item.quantity * item.unitPrice,
                'Supplier': item.supplier,
                'Location': item.location,
                'Status': item.status
              }));
              
              const csvContent = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              toast.success('Inventory report exported successfully!');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            type="button"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Stock Report
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Items"
          value={totalItems}
          change="In inventory"
          changeType="neutral"
          icon={Archive}
          color="blue"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockItems}
          change="Need reordering"
          changeType="negative"
          icon={TrendingDown}
          color="yellow"
        />
        <StatsCard
          title="Out of Stock"
          value={outOfStockItems}
          change="Critical items"
          changeType="negative"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Total Value"
          value={`EGP ${(totalValue / 1000).toFixed(0)}K`}
          change="Current inventory"
          changeType="neutral"
          icon={Package}
          color="green"
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
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Construction Materials">Construction Materials</option>
              <option value="Steel & Metal">Steel & Metal</option>
              <option value="Finishing Materials">Finishing Materials</option>
              <option value="Tools & Equipment">Tools & Equipment</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inventory Items ({filteredInventory.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
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
              {filteredInventory.map((item) => {
                const stockInfo = getStockLevel(item.quantity, item.minStock, item.maxStock);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.itemName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{item.sku}</div>
                        <div className="text-xs text-gray-400">{item.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${stockInfo.color}`}
                            style={{ width: `${Math.min((item.quantity / item.maxStock) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Min: {item.minStock} | Max: {item.maxStock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {(item.quantity * item.unitPrice).toLocaleString()} EGP
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        @ {item.unitPrice} EGP/unit
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{item.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{item.location}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Updated: {item.lastUpdated}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => toast(`Viewing details for ${item.itemName}`)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          type="button"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => toast(`Editing ${item.itemName}`)}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          type="button"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => toast(`Managing stock for ${item.itemName}`)}
                          className="text-gray-400 hover:text-purple-600 transition-colors"
                          type="button"
                        >
                          <Package className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleMoreInventoryOptions(item.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          type="button"
                        >
                          <MoreHorizontal className="h-4 w-4" />
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
      
      <AddInventoryItemModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  );
};

export default InventoryPage;