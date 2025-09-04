import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  BarChart3,
  MoreHorizontal
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import AddPropertyModal from '../../components/Modals/AddPropertyModal';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/currency';

const AssetsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample assets data
  const assets = [
    {
      id: '1',
      name: 'Construction Crane - Tower 1',
      category: 'Heavy Equipment',
      serialNumber: 'CR-2023-001',
      purchaseDate: '2023-06-15',
      purchasePrice: 2500000,
      currentValue: 2200000,
      depreciation: 12,
      location: 'Cairo Heights Construction Site',
      assignedTo: 'Ahmed Mahmoud',
      status: 'active' as const,
      warrantyExpiry: '2025-06-15',
      maintenanceSchedule: 'Monthly'
    },
    {
      id: '2',
      name: 'Office Furniture Set - Floor 3',
      category: 'Office Equipment',
      serialNumber: 'OF-2023-045',
      purchaseDate: '2023-08-20',
      purchasePrice: 85000,
      currentValue: 75000,
      depreciation: 8,
      location: 'Main Office - 3rd Floor',
      assignedTo: 'Sarah Johnson',
      status: 'active' as const,
      warrantyExpiry: '2026-08-20',
      maintenanceSchedule: 'Quarterly'
    },
    {
      id: '3',
      name: 'Company Vehicle - Toyota Hilux',
      category: 'Vehicles',
      serialNumber: 'VH-2022-003',
      purchaseDate: '2022-03-10',
      purchasePrice: 450000,
      currentValue: 320000,
      depreciation: 20,
      location: 'Main Office Parking',
      assignedTo: 'Omar Ali',
      status: 'maintenance' as const,
      warrantyExpiry: '2025-03-10',
      maintenanceSchedule: 'Every 6 months'
    }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      case 'disposed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalAssets = assets.length;
  const activeAssets = assets.filter(a => a.status === 'active').length;
  const maintenanceAssets = assets.filter(a => a.status === 'maintenance').length;
  const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);

  const handleMoreAssetOptions = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      const options = [
        'Schedule Maintenance',
        'Transfer Asset',
        'Update Valuation',
        'Asset History',
        'Insurance Details',
        'Depreciation Report',
        'Dispose Asset'
      ];
      
      const optionsMenu = document.createElement('div');
      optionsMenu.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      optionsMenu.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Asset Actions</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${asset.name}</p>
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
            toast.success(`${options[actionIndex]} selected for ${asset.name}`);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage company assets and equipment</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              const csvData = filteredAssets.map(asset => ({
                'Asset Name': asset.name,
                'Category': asset.category,
                'Serial Number': asset.serialNumber,
                'Current Value': asset.currentValue,
                'Purchase Price': asset.purchasePrice,
                'Depreciation': asset.depreciation + '%',
                'Assigned To': asset.assignedTo,
                'Location': asset.location,
                'Status': asset.status
              }));
              
              const csvContent = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `assets-report-${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              toast.success('Asset report exported successfully!');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            type="button"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Asset Report
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            <span onClick={() => setShowAddModal(true)}>Add Asset</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Assets"
          value={totalAssets}
          change="Company owned"
          changeType="neutral"
          icon={Shield}
          color="blue"
        />
        <StatsCard
          title="Active Assets"
          value={activeAssets}
          change={`${((activeAssets / totalAssets) * 100).toFixed(1)}% operational`}
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Under Maintenance"
          value={maintenanceAssets}
          change="Require attention"
          changeType="neutral"
          icon={Wrench}
          color="yellow"
        />
        <StatsCard
          title="Total Value"
          value={`${(totalValue / 1000000).toFixed(1)}M EGP`}
          change="Current book value"
          changeType="neutral"
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Assets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assets ({filteredAssets.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Asset Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Value & Depreciation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Maintenance
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
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{asset.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{asset.serialNumber}</div>
                      <div className="text-xs text-gray-400">{asset.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {asset.currentValue.toLocaleString()} EGP
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Purchase: {asset.purchasePrice.toLocaleString()} EGP
                    </div>
                    <div className="text-xs text-red-600">
                      -{asset.depreciation}% depreciation
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{asset.assignedTo}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{asset.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{asset.maintenanceSchedule}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Warranty: {asset.warrantyExpiry}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
                      {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => toast(`Viewing asset: ${asset.name}`)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        type="button"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => toast(`Editing asset: ${asset.name}`)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        type="button"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => toast.success(`Scheduling maintenance for: ${asset.name}`)}
                        className="text-gray-400 hover:text-yellow-600 transition-colors"
                        type="button"
                      >
                        <Wrench className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleMoreAssetOptions(asset.id)}
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
      
      <AddPropertyModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
     </div>
   );
 };

export default AssetsPage