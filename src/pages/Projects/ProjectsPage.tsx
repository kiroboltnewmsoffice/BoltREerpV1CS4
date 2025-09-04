import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import AddProjectModal from '../../components/Modals/AddProjectModal';
import ViewProjectModal from '../../components/Modals/ViewProjectModal';
import EditProjectModal from '../../components/Modals/EditProjectModal';
import { formatCurrency, formatCurrencyShort } from '../../utils/currency';

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Sample projects data
  const projects = [
    {
      id: '1',
      name: 'Cairo Heights Construction',
      description: 'Luxury residential tower development in New Cairo',
      propertyId: '1',
      manager: 'Ahmed Mahmoud',
      team: ['Omar Ali', 'Fatima Hassan', 'Mohamed Saeed'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 50000000,
      actualCost: 32000000,
      status: 'active' as const,
      progress: 65,
      milestones: [
        { id: '1', title: 'Foundation Complete', status: 'completed' as const, dueDate: '2024-03-15' },
        { id: '2', title: 'Structure Complete', status: 'completed' as const, dueDate: '2024-06-30' },
        { id: '3', title: 'Interior Work', status: 'pending' as const, dueDate: '2024-09-30' },
        { id: '4', title: 'Final Inspection', status: 'pending' as const, dueDate: '2024-11-30' }
      ]
    },
    {
      id: '2',
      name: 'Business Central Renovation',
      description: 'Office space modernization and upgrade',
      propertyId: '2',
      manager: 'Sarah Ahmed',
      team: ['Ali Hassan', 'Nour Mohamed'],
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      budget: 15000000,
      actualCost: 8500000,
      status: 'active' as const,
      progress: 45,
      milestones: [
        { id: '1', title: 'Design Approval', status: 'completed' as const, dueDate: '2024-02-15' },
        { id: '2', title: 'Demolition', status: 'completed' as const, dueDate: '2024-03-31' },
        { id: '3', title: 'Construction', status: 'pending' as const, dueDate: '2024-06-30' },
        { id: '4', title: 'Finishing', status: 'pending' as const, dueDate: '2024-08-15' }
      ]
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleViewProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setShowViewModal(true);
    }
  };

  const handleEditProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setShowEditModal(true);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage construction and development projects</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Projects"
          value={projects.filter(p => p.status === 'active').length}
          change="Currently running"
          changeType="positive"
          icon={Briefcase}
          color="blue"
        />
        <StatsCard
          title="Total Budget"
          value={formatCurrencyShort(projects.reduce((sum, p) => sum + p.budget, 0))}
          change="Allocated funds"
          changeType="neutral"
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Average Progress"
          value={`${(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length).toFixed(0)}%`}
          change="Overall completion"
          changeType="positive"
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Team Members"
          value={projects.reduce((sum, p) => sum + p.team.length, 0)}
          change="Total assigned"
          changeType="neutral"
          icon={Users}
          color="yellow"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{project.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{project.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrencyShort(project.budget)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrencyShort(project.actualCost)}
                </p>
              </div>
            </div>

            {/* Manager and Team */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Project Manager</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{project.manager}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Team ({project.team.length})</p>
              <div className="flex -space-x-2">
                {project.team.slice(0, 3).map((member, index) => (
                  <div key={index} className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <span className="text-xs font-medium text-white">
                      {member.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                ))}
                {project.team.length > 3 && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <span className="text-xs font-medium text-white">+{project.team.length - 3}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Milestones */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Milestones</p>
              <div className="space-y-2">
                {project.milestones.slice(0, 2).map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      <span className="text-sm text-gray-900 dark:text-white">{milestone.title}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{milestone.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => handleViewProject(project.id)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                type="button"
              >
                View Details
              </button>
              <button 
                onClick={() => handleViewProject(project.id)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                type="button"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleEditProject(project.id)}
                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                type="button"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <AddProjectModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <ViewProjectModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        project={selectedProject}
      />
      
      <EditProjectModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        project={selectedProject}
      />
    </div>
  );
};

export default ProjectsPage;