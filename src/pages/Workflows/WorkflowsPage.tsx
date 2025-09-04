import React, { useState } from 'react';
import {
  Workflow,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Users,
  Settings,
  Eye,
  Edit,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import toast from 'react-hot-toast';
import CreateWorkflowModal from '../../components/Modals/CreateWorkflowModal';

const WorkflowsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample workflows data
  const workflows = [
    {
      id: '1',
      name: 'Customer Onboarding Process',
      description: 'Complete workflow for new customer registration and verification',
      module: 'CRM',
      status: 'active' as const,
      createdBy: 'John Anderson',
      createdAt: '2024-01-01',
      steps: [
        { id: '1', name: 'Initial Contact', assignedRole: 'sales_representative', order: 1, isRequired: true },
        { id: '2', name: 'Document Collection', assignedRole: 'customer_service', order: 2, isRequired: true },
        { id: '3', name: 'Credit Check', assignedRole: 'finance_manager', order: 3, isRequired: true },
        { id: '4', name: 'Approval', assignedRole: 'sales_manager', order: 4, isRequired: true }
      ]
    },
    {
      id: '2',
      name: 'Property Sale Process',
      description: 'End-to-end property sale workflow from inquiry to contract signing',
      module: 'Sales',
      status: 'active' as const,
      createdBy: 'Mike Wilson',
      createdAt: '2024-01-05',
      steps: [
        { id: '1', name: 'Property Inquiry', assignedRole: 'sales_representative', order: 1, isRequired: true },
        { id: '2', name: 'Property Viewing', assignedRole: 'sales_representative', order: 2, isRequired: false },
        { id: '3', name: 'Price Negotiation', assignedRole: 'sales_manager', order: 3, isRequired: true },
        { id: '4', name: 'Contract Preparation', assignedRole: 'legal_manager', order: 4, isRequired: true },
        { id: '5', name: 'Contract Signing', assignedRole: 'sales_manager', order: 5, isRequired: true }
      ]
    },
    {
      id: '3',
      name: 'Cheque Processing Workflow',
      description: 'Automated workflow for post-dated cheque processing and collection',
      module: 'Finance',
      status: 'active' as const,
      createdBy: 'Sarah Johnson',
      createdAt: '2024-01-10',
      steps: [
        { id: '1', name: 'Cheque Receipt', assignedRole: 'accountant', order: 1, isRequired: true },
        { id: '2', name: 'Due Date Alert', assignedRole: 'finance_manager', order: 2, isRequired: true },
        { id: '3', name: 'Bank Submission', assignedRole: 'accountant', order: 3, isRequired: true },
        { id: '4', name: 'Clearance Confirmation', assignedRole: 'finance_manager', order: 4, isRequired: true }
      ]
    }
  ];

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    const matchesModule = moduleFilter === 'all' || workflow.module === moduleFilter;
    return matchesSearch && matchesStatus && matchesModule;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'CRM': return 'bg-blue-100 text-blue-800';
      case 'Sales': return 'bg-green-100 text-green-800';
      case 'Finance': return 'bg-purple-100 text-purple-800';
      case 'HR': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalWorkflows = workflows.length;
  const activeWorkflows = workflows.filter(w => w.status === 'active').length;
  const totalSteps = workflows.reduce((sum, w) => sum + w.steps.length, 0);
  const avgStepsPerWorkflow = (totalSteps / totalWorkflows).toFixed(1);

  const handleMoreWorkflowOptions = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      const options = [
        'Duplicate Workflow',
        'Export Template',
        'View Analytics',
        'Test Workflow',
        'Workflow History',
        'Share Workflow',
        'Archive Workflow'
      ];
      
      const optionsMenu = document.createElement('div');
      optionsMenu.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      optionsMenu.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workflow Actions</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${workflow.name}</p>
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
            toast.success(`${options[actionIndex]} selected for "${workflow.name}"`);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workflow Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Design and manage business process workflows</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Workflows"
          value={totalWorkflows}
          change="Business processes"
          changeType="neutral"
          icon={Workflow}
          color="blue"
        />
        <StatsCard
          title="Active Workflows"
          value={activeWorkflows}
          change="Currently running"
          changeType="positive"
          icon={Play}
          color="green"
        />
        <StatsCard
          title="Total Steps"
          value={totalSteps}
          change={`${avgStepsPerWorkflow} avg per workflow`}
          changeType="neutral"
          icon={CheckCircle}
          color="purple"
        />
        <StatsCard
          title="Automation Rate"
          value="85%"
          change="Process automation"
          changeType="positive"
          icon={Settings}
          color="yellow"
        />
      </div>

      {/* Workflows List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Workflows ({filteredWorkflows.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredWorkflows.map((workflow) => (
            <div key={workflow.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{workflow.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getModuleColor(workflow.module)}`}>
                      {workflow.module}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                      {workflow.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{workflow.description}</p>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Workflow Steps ({workflow.steps.length})
                    </h5>
                    <div className="flex items-center space-x-2 overflow-x-auto">
                      {workflow.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {step.order}. {step.name}
                            </span>
                            {step.isRequired && (
                              <span className="text-xs text-red-600">*</span>
                            )}
                          </div>
                          {index < workflow.steps.length - 1 && (
                            <div className="w-4 h-px bg-gray-300 dark:bg-gray-600 mx-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Created by: {workflow.createdBy}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created: {workflow.createdAt}
                    </div>
                    <button 
                      onClick={() => handleMoreWorkflowOptions(workflow.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      type="button"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => {
                      toast.success(`Opening workflow details: ${workflow.name}`);
                      // TODO: Implement ViewWorkflowModal
                    }}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      toast.success(`Opening edit form for workflow: ${workflow.name}`);
                      // TODO: Implement EditWorkflowModal
                    }}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                    type="button"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => toast.success(`Configuring workflow: ${workflow.name}`)}
                    className="text-gray-400 hover:text-yellow-600 transition-colors"
                    type="button"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <CreateWorkflowModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};

export default WorkflowsPage;