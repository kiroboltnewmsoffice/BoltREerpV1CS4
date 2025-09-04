import React, { useEffect } from 'react';
import { X, Target, TrendingUp, Users, DollarSign, Calendar, Eye, Mail, MessageSquare } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

interface Campaign {
  id: string;
  name: string;
  type: 'digital' | 'email' | 'social' | 'print';
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  leads: number;
  conversions: number;
  roi: number;
  description?: string;
  channels?: string[];
  metrics?: {
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    cpm: number;
  };
}

interface ViewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

const ViewCampaignModal: React.FC<ViewCampaignModalProps> = ({ isOpen, onClose, campaign }) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !campaign) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'digital': return 'bg-purple-100 text-purple-800';
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      case 'print': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const budgetUtilization = (campaign.spent / campaign.budget) * 100;
  const conversionRate = campaign.leads > 0 ? (campaign.conversions / campaign.leads * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Campaign Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Campaign Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Overview</h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{campaign.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {campaign.description || 'No description available'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(campaign.type)}`}>
                    {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center">
                  <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center">
                  <Users className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Target Audience</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {campaign.targetAudience}
                  </p>
                </div>
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
                  <p className="font-semibold text-green-600">{campaign.roi}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Performance */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget & Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget Overview */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Budget Utilization</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Budget</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(campaign.budget)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount Spent</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(campaign.spent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(campaign.budget - campaign.spent)}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Utilization</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {budgetUtilization.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          budgetUtilization > 90 ? 'bg-red-500' : 
                          budgetUtilization > 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Leads</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{campaign.leads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Conversions</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{campaign.conversions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {conversionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cost per Lead</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {campaign.leads > 0 ? formatCurrency(campaign.spent / campaign.leads) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cost per Conversion</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {campaign.conversions > 0 ? formatCurrency(campaign.spent / campaign.conversions) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Metrics (if available) */}
          {campaign.metrics && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Digital Metrics</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Impressions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {campaign.metrics.impressions.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Clicks</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {campaign.metrics.clicks.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">CTR</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {campaign.metrics.ctr.toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">CPC</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(campaign.metrics.cpc)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">CPM</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(campaign.metrics.cpm)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Channels (if available) */}
          {campaign.channels && campaign.channels.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Marketing Channels</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {campaign.channels.map((channel, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                    >
                      {channel.toLowerCase().includes('email') && <Mail className="h-3 w-3" />}
                      {channel.toLowerCase().includes('social') && <MessageSquare className="h-3 w-3" />}
                      {!channel.toLowerCase().includes('email') && !channel.toLowerCase().includes('social') && <Target className="h-3 w-3" />}
                      <span>{channel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCampaignModal;
