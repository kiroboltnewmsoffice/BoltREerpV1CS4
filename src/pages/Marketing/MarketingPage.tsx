import React, { useState } from 'react';
import {
  Target,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  Mail,
  MessageSquare,
  Eye,
  Edit,
  Play,
  Pause,
  MoreHorizontal
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';
import CreateCampaignModal from '../../components/Modals/CreateCampaignModal';
import { formatCurrency } from '../../utils/currency';

const MarketingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);

  // Sample campaigns data
  const campaigns = [
    {
      id: '1',
      name: 'New Cairo Luxury Homes',
      type: 'digital' as const,
      status: 'active' as const,
      budget: 150000,
      spent: 95000,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      targetAudience: 'High-income families in Cairo',
      leads: 245,
      conversions: 18,
      roi: 340
    },
    {
      id: '2',
      name: 'Commercial Space Email Campaign',
      type: 'email' as const,
      status: 'active' as const,
      budget: 50000,
      spent: 32000,
      startDate: '2024-01-15',
      endDate: '2024-02-28',
      targetAudience: 'Business owners and investors',
      leads: 156,
      conversions: 12,
      roi: 280
    },
    {
      id: '3',
      name: 'Social Media Awareness',
      type: 'social' as const,
      status: 'completed' as const,
      budget: 75000,
      spent: 73000,
      startDate: '2023-12-01',
      endDate: '2024-01-15',
      targetAudience: 'Young professionals 25-40',
      leads: 189,
      conversions: 8,
      roi: 165
    }
  ];

  // Sample leads data
  const leads = [
    {
      id: '1',
      name: 'Mahmoud Ahmed',
      email: 'mahmoud@email.com',
      phone: '+20-10-555-1234',
      source: 'Google Ads',
      status: 'qualified' as const,
      score: 85,
      assignedTo: 'Ahmed Sales Rep',
      interestedIn: ['Residential', '2-3 Bedrooms'],
      budget: 2500000,
      timeline: '3-6 months',
      notes: 'Looking for family home in New Cairo',
      createdAt: '2024-01-20',
      lastContact: '2024-01-24'
    },
    {
      id: '2',
      name: 'Nadia Hassan',
      email: 'nadia@email.com',
      phone: '+20-11-777-5678',
      source: 'Facebook',
      status: 'new' as const,
      score: 65,
      assignedTo: 'Sara Sales Rep',
      interestedIn: ['Commercial', 'Office Space'],
      budget: 5000000,
      timeline: '6-12 months',
      notes: 'Investment opportunity inquiry',
      createdAt: '2024-01-25',
      lastContact: '2024-01-25'
    }
  ];

  const campaignPerformanceData = [
    { month: 'Oct', leads: 120, conversions: 8, spend: 45000 },
    { month: 'Nov', leads: 156, conversions: 12, spend: 52000 },
    { month: 'Dec', leads: 189, conversions: 15, spend: 48000 },
    { month: 'Jan', leads: 245, conversions: 18, spend: 65000 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'converted': return 'bg-green-100 text-green-800';
      case 'qualified': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'new': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMoreLeadOptions = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      const options = [
        'Convert to Customer',
        'Schedule Follow-up',
        'Send Brochure',
        'Update Score',
        'Add to Campaign',
        'Lead History',
        'Mark as Lost'
      ];
      
      const optionsMenu = document.createElement('div');
      optionsMenu.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      optionsMenu.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Actions</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${lead.name}</p>
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
            toast.success(`${options[actionIndex]} selected for ${lead.name}`);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage campaigns, leads, and marketing analytics</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              const csvData = campaigns.map(c => ({
                'Campaign Name': c.name,
                'Type': c.type,
                'Status': c.status,
                'Budget': c.budget,
                'Spent': c.spent,
                'Leads': c.leads,
                'Conversions': c.conversions,
                'ROI': c.roi + '%'
              }));
              
              const csvContent = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `marketing-report-${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              toast.success('Marketing report exported successfully!');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            type="button"
          >
            <Target className="h-4 w-4 mr-2" />
            Campaign Report
          </button>
          <button 
            onClick={() => setShowCreateCampaignModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Campaigns"
          value={campaigns.filter(c => c.status === 'active').length}
          change="Currently running"
          changeType="positive"
          icon={Target}
          color="blue"
        />
        <StatsCard
          title="Total Leads"
          value={campaigns.reduce((sum, c) => sum + c.leads, 0)}
          change="+23% this month"
          changeType="positive"
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Conversions"
          value={campaigns.reduce((sum, c) => sum + c.conversions, 0)}
          change={`${((campaigns.reduce((sum, c) => sum + c.conversions, 0) / campaigns.reduce((sum, c) => sum + c.leads, 0)) * 100).toFixed(1)}% rate`}
          changeType="positive"
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Marketing Spend"
          value={`${(campaigns.reduce((sum, c) => sum + c.spent, 0) / 1000).toFixed(0)}K EGP`}
          change="This quarter"
          changeType="neutral"
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Campaign Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={campaignPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} name="Leads" />
            <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} name="Conversions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Campaigns and Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Campaigns</h3>
          </div>
          <div className="p-6 space-y-4">
            {campaigns.filter(c => c.status === 'active').map((campaign) => (
              <div key={campaign.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{campaign.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.targetAudience}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toast.success(`Starting campaign: ${campaign.name}`)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      type="button"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => toast.success(`Pausing campaign: ${campaign.name}`)}
                      className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                      type="button"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                    <p className="font-medium text-gray-900 dark:text-white">EGP {campaign.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Spent:</span>
                    <p className="font-medium text-gray-900 dark:text-white">EGP {campaign.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Leads:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{campaign.leads}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">ROI:</span>
                    <p className="font-medium text-green-600">{campaign.roi}%</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Budget Usage</span>
                    <span>{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Leads</h3>
          </div>
          <div className="p-6 space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{lead.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLeadStatusColor(lead.status)}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Score:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{lead.score}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Source:</span>
                    <span className="text-gray-900 dark:text-white">{lead.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                    <span className="text-gray-900 dark:text-white">{lead.budget.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Timeline:</span>
                    <span className="text-gray-900 dark:text-white">{lead.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Interested in:</span>
                    <span className="text-gray-900 dark:text-white">{lead.interestedIn.join(', ')}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => toast.success(`Contacting lead: ${lead.name}`)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    type="button"
                  >
                    Contact Lead
                  </button>
                  <button 
                    onClick={() => toast(`Opening chat with ${lead.name}`)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    type="button"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      // Open lead details in a proper modal
                      toast.success(`Opening detailed lead profile for ${lead.name}`);
                      // TODO: Implement ViewLeadModal
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleMoreLeadOptions(lead.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    type="button"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <CreateCampaignModal 
        isOpen={showCreateCampaignModal} 
        onClose={() => setShowCreateCampaignModal(false)} 
      />
    </div>
  );
};

export default MarketingPage;