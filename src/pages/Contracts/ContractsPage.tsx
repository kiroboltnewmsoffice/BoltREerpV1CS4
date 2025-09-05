import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Building,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import StatsCard from '../../components/Dashboard/StatsCard';
import AddContractModal from '../../components/Modals/AddContractModal';
import ViewContractModal from '../../components/Modals/ViewContractModal';
import EditContractModal from '../../components/Modals/EditContractModal';
import { formatCurrency, formatCurrencyShort } from '../../utils/currency';
import { downloadFile, generateContractDocument } from '../../utils/downloads';
import { format } from 'date-fns';

const ContractsPage: React.FC = () => {
  const { contracts = [], customers, units, properties, updateContract } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);

  // Sample contracts data (since it's empty in the store)
  const sampleContracts = [
    {
      id: '1',
      customerId: '1',
      unitId: '1',
      contractNumber: 'CNT-2024-001',
      signedDate: '2024-01-15',
      totalValue: 850000,
      paymentTerms: '10% down payment, 90% in 24 monthly installments',
      status: 'signed' as const,
      documents: ['contract.pdf', 'payment_schedule.pdf'],
      legalReviewed: true,
      reviewedBy: 'Legal Department'
    },
    {
      id: '2',
      customerId: '2',
      unitId: '2',
      contractNumber: 'CNT-2024-002',
      signedDate: '2024-01-20',
      totalValue: 650000,
      paymentTerms: '20% down payment, 80% in 18 monthly installments',
      status: 'pending_signature' as const,
      documents: ['draft_contract.pdf'],
      legalReviewed: true,
      reviewedBy: 'Legal Department'
    }
  ];

  const allContracts = contracts.length > 0 ? contracts : sampleContracts;

  // Filter contracts
  const filteredContracts = allContracts.filter(contract => {
    const customer = customers.find(c => c.id === contract.customerId);
    const matchesSearch = contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.totalValue.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalContracts = allContracts.length;
  const signedContracts = allContracts.filter(c => c.status === 'signed').length;
  const pendingContracts = allContracts.filter(c => c.status === 'pending_signature').length;
  const draftContracts = allContracts.filter(c => c.status === 'draft').length;
  const totalValue = allContracts.reduce((sum, c) => sum + c.totalValue, 0);

  const handleViewContract = (contractId: string) => {
    const contract = allContracts.find(c => c.id === contractId);
    if (contract) {
      setSelectedContract(contract);
      setShowViewModal(true);
    }
  };

  const handleEditContract = (contractId: string) => {
    const contract = allContracts.find(c => c.id === contractId);
    if (contract) {
      setSelectedContract(contract);
      setShowEditModal(true);
    }
  };

  const handleDownloadContract = (contractId: string) => {
    const contract = allContracts.find(c => c.id === contractId);
    if (contract) {
      const customer = customers.find(c => c.id === contract.customerId);
      const unit = units.find(u => u.id === contract.unitId);
      const property = properties.find(p => p.id === unit?.propertyId);
      
      // Generate comprehensive contract content using utility
      const contractContent = generateContractDocument(contract, customer, unit, property);
      
      // Download the contract
      downloadFile(contractContent, `${contract.contractNumber}-contract.txt`);
      toast.success(`Downloaded contract: ${contract.contractNumber}`);
    } else {
      toast.error('Contract not found');
    }
  };

  const handleMoreOptions = (contractId: string) => {
    const contract = allContracts.find(c => c.id === contractId);
    if (contract) {
      const customer = customers.find(c => c.id === contract.customerId);
      
      // Create a more sophisticated options menu
      const optionsMenu = document.createElement('div');
      optionsMenu.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      optionsMenu.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contract Actions</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${contract.contractNumber} - ${customer?.name}</p>
          <div class="space-y-2">
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white" data-action="duplicate">📋 Duplicate Contract</button>
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white" data-action="send">📧 Send to Customer</button>
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white" data-action="print">🖨️ Print Contract</button>
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white" data-action="history">📊 Contract History</button>
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white" data-action="archive">📁 Archive Contract</button>
            <button class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white" data-action="terminate">❌ Terminate Contract</button>
          </div>
          <button class="w-full mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" data-action="close">Close</button>
        </div>
      `;
      
      document.body.appendChild(optionsMenu);
      
      // Handle option clicks
      optionsMenu.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const action = target.getAttribute('data-action');
        
        if (action) {
          document.body.removeChild(optionsMenu);
          
          switch (action) {
            case 'duplicate':
              toast.success(`Duplicating contract ${contract.contractNumber}`);
              break;
            case 'send':
              toast.success(`Sending ${contract.contractNumber} to ${customer?.name}`);
              break;
            case 'print':
              window.print();
              toast.success(`Printing contract ${contract.contractNumber}`);
              break;
            case 'history':
              toast.success(`Viewing history for ${contract.contractNumber}`);
              break;
            case 'archive':
              if (window.confirm(`Archive contract ${contract.contractNumber}?`)) {
                toast.success(`Contract ${contract.contractNumber} archived`);
              }
              break;
            case 'terminate':
              if (window.confirm(`Terminate contract ${contract.contractNumber}? This action cannot be undone.`)) {
                updateContract(contract.id, { status: 'terminated' });
                toast.success(`Contract ${contract.contractNumber} terminated`);
              }
              break;
            case 'close':
              break;
          }
        }
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'executed': return 'bg-blue-100 text-blue-800';
      case 'pending_signature': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return CheckCircle;
      case 'executed': return CheckCircle;
      case 'pending_signature': return Clock;
      case 'draft': return FileText;
      case 'terminated': return AlertCircle;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contract Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage sales contracts and legal documents</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              const csvData = filteredContracts.map(c => {
                const customer = customers.find(cust => cust.id === c.customerId);
                const unit = units.find(u => u.id === c.unitId);
                const property = properties.find(p => p.id === unit?.propertyId);
                return {
                  'Contract Number': c.contractNumber,
                  'Customer': customer?.name || 'Unknown',
                  'Property': property?.name || 'Unknown',
                  'Unit': unit?.unitNumber || 'N/A',
                  'Value': c.totalValue,
                  'Status': c.status,
                  'Signed Date': c.signedDate
                };
              });
              
              const csvContent = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `contracts-report-${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              toast.success('Contracts exported successfully!');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            type="button"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Contracts
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Contracts"
          value={totalContracts}
          change={`${formatCurrencyShort(totalValue)} total value`}
          changeType="neutral"
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Signed Contracts"
          value={signedContracts}
          change={`${((signedContracts / totalContracts) * 100).toFixed(1)}% completion rate`}
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Pending Signature"
          value={pendingContracts}
          change="Awaiting customer"
          changeType="neutral"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Draft Contracts"
          value={draftContracts}
          change="In preparation"
          changeType="neutral"
          icon={FileText}
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
                placeholder="Search contracts..."
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
              <option value="draft">Draft</option>
              <option value="pending_signature">Pending Signature</option>
              <option value="signed">Signed</option>
              <option value="executed">Executed</option>
              <option value="terminated">Terminated</option>
            </select>
            
            <button className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contracts ({filteredContracts.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Property/Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Signed Date
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
              {filteredContracts.map((contract) => {
                const customer = customers.find(c => c.id === contract.customerId);
                const unit = units.find(u => u.id === contract.unitId);
                const property = properties.find(p => p.id === unit?.propertyId);
                const StatusIcon = getStatusIcon(contract.status);
                
                return (
                  <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {contract.contractNumber}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {contract.documents.length} documents
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-white">
                            {customer?.name.split(' ').map(n => n[0]).join('') || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer?.name || 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {customer?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {property?.name || 'Unknown Property'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Unit: {unit?.unitNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(contract.totalValue)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {contract.paymentTerms.length > 30 ? 
                          contract.paymentTerms.substring(0, 30) + '...' : 
                          contract.paymentTerms}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {format(new Date(contract.signedDate), 'MMM dd, yyyy')}
                      </div>
                      {contract.legalReviewed && (
                        <div className="text-xs text-green-600">Legal Reviewed</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="h-4 w-4 mr-2" />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)}`}>
                          {contract.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewContract(contract.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          type="button"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditContract(contract.id)}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          type="button"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadContract(contract.id)}
                          className="text-gray-400 hover:text-purple-600 transition-colors"
                          type="button"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleMoreOptions(contract.id)}
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

        {filteredContracts.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No contracts found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search criteria or create a new contract.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create New Contract
            </button>
          </div>
        )}
      </div>
      
      <AddContractModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <ViewContractModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        contract={selectedContract}
        customers={customers}
        units={units}
        properties={properties}
      />
      
      <EditContractModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        contract={selectedContract}
      />
    </div>
  );
};

export default ContractsPage;