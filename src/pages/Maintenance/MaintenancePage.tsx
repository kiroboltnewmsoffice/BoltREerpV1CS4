import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Building,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import ScheduleMaintenanceModal from '../../components/Modals/ScheduleMaintenanceModal';
import ViewMaintenanceRequestModal from '../../components/Modals/ViewMaintenanceRequestModal';
import EditMaintenanceRequestModal from '../../components/Modals/EditMaintenanceRequestModal';
import { formatCurrency } from '../../utils/currency';

const MaintenancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof maintenanceRequests[0] | null>(null);

  // Sample maintenance data
  const maintenanceRequests = [
    {
      id: '1',
      assetId: '1',
      propertyId: '1',
      title: 'Elevator Maintenance - Tower A',
      description: 'Monthly preventive maintenance for passenger elevator',
      type: 'preventive' as const,
      priority: 'medium' as const,
      status: 'scheduled' as const,
      scheduledDate: '2024-02-01',
      assignedTo: 'Ahmed Maintenance Team',
      cost: 15000,
      notes: 'Regular monthly check-up'
    },
    {
      id: '2',
      assetId: '2',
      propertyId: '2',
      title: 'Air Conditioning Repair - Office',
      description: 'AC unit not cooling properly in conference room',
      type: 'corrective' as const,
      priority: 'high' as const,
      status: 'in_progress' as const,
      scheduledDate: '2024-01-26',
      assignedTo: 'Mohamed HVAC Specialist',
      cost: 8500,
      notes: 'Compressor issue identified'
    },
    {
      id: '3',
      assetId: '3',
      propertyId: '2',
      title: 'Emergency Plumbing - Unit B-405',
      description: 'Water leak in bathroom requires immediate attention',
      type: 'emergency' as const,
      priority: 'urgent' as const,
      status: 'completed' as const,
      scheduledDate: '2024-01-24',
      completedDate: '2024-01-24',
      assignedTo: 'Hassan Plumbing Services',
      cost: 3200,
      actualCost: 3500,
      notes: 'Pipe replacement completed successfully'
    }
  ];

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRequests = maintenanceRequests.length;
  const pendingRequests = maintenanceRequests.filter(r => r.status === 'scheduled').length;
  const completedRequests = maintenanceRequests.filter(r => r.status === 'completed').length;
  const totalCost = maintenanceRequests.reduce((sum, r) => sum + r.cost, 0);

  // Modal handlers
  const handleViewRequest = (request: typeof maintenanceRequests[0]) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleEditRequest = (request: typeof maintenanceRequests[0]) => {
    setSelectedRequest(request);
    setShowEditModal(true);
  };

  const handleSaveRequest = (updatedRequest: any) => {
    console.log('Updated request:', updatedRequest);
    toast.success('Maintenance request updated successfully!');
    // In a real app, update the request in the data store
  };

  const handleMoreMaintenanceOptions = (requestId: string) => {
    const request = maintenanceRequests.find(r => r.id === requestId);
    if (request) {
      const options = [
        'Update Status',
        'Add Photos',
        'Request Quote',
        'Assign Technician',
        'Schedule Follow-up',
        'Maintenance History',
        'Close Request'
      ];
      
      const optionsMenu = document.createElement('div');
      optionsMenu.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      optionsMenu.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Maintenance Actions</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${request.title}</p>
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
            toast.success(`${options[actionIndex]} selected for "${request.title}"`);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Schedule and track property and asset maintenance</p>
        </div>
        <button 
          onClick={() => setShowScheduleModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Requests"
          value={totalRequests}
          change="This month"
          changeType="neutral"
          icon={Wrench}
          color="blue"
        />
        <StatsCard
          title="Pending"
          value={pendingRequests}
          change="Scheduled"
          changeType="neutral"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Completed"
          value={completedRequests}
          change={`${((completedRequests / totalRequests) * 100).toFixed(1)}% completion rate`}
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Total Cost"
          value={`${(totalCost / 1000).toFixed(0)}K EGP`}
          change="This month"
          changeType="neutral"
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Maintenance Requests */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Maintenance Requests ({filteredRequests.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredRequests.map((request) => (
            <div key={request.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{request.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{request.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-900 dark:text-white">Assigned to:</div>
                        <div className="text-gray-500 dark:text-gray-400">{request.assignedTo}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-900 dark:text-white">Scheduled:</div>
                        <div className="text-gray-500 dark:text-gray-400">{request.scheduledDate}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-900 dark:text-white">Cost:</div>
                        <div className="text-gray-500 dark:text-gray-400">EGP {request.cost.toLocaleString()}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleMoreMaintenanceOptions(request.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      type="button"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => handleViewRequest(request)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEditRequest(request)}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                    type="button"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <ScheduleMaintenanceModal 
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)} 
      />
      
      <ViewMaintenanceRequestModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        request={selectedRequest}
      />
      
      <EditMaintenanceRequestModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        request={selectedRequest}
        onSave={handleSaveRequest}
      />
    </div>
  );
};

export default MaintenancePage;