import React, { useState } from 'react';
import { X, Target, Save, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';

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
}

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  onSave?: (updatedCampaign: Campaign) => void;
}

const EditCampaignModal: React.FC<EditCampaignModalProps> = ({ 
  isOpen, 
  onClose, 
  campaign, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    description: campaign?.description || '',
    type: campaign?.type || 'digital',
    status: campaign?.status || 'draft',
    budget: campaign?.budget || 0,
    startDate: campaign?.startDate || '',
    endDate: campaign?.endDate || '',
    targetAudience: campaign?.targetAudience || '',
    channels: campaign?.channels || []
  });

  const [newChannel, setNewChannel] = useState('');

  React.useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        description: campaign.description || '',
        type: campaign.type,
        status: campaign.status,
        budget: campaign.budget,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        targetAudience: campaign.targetAudience,
        channels: campaign.channels || []
      });
    }
  }, [campaign]);

  const campaignTypes = [
    { value: 'digital', label: 'Digital Marketing' },
    { value: 'email', label: 'Email Marketing' },
    { value: 'social', label: 'Social Media' },
    { value: 'print', label: 'Print Media' }
  ];

  const campaignStatuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' }
  ];

  const predefinedChannels = [
    'Google Ads',
    'Facebook Ads',
    'Instagram',
    'LinkedIn',
    'Twitter',
    'Email Newsletter',
    'SMS Marketing',
    'Print Ads',
    'Radio',
    'TV',
    'Outdoor Billboards',
    'Content Marketing',
    'SEO',
    'Affiliate Marketing'
  ];

  const handleAddChannel = (channel: string = newChannel) => {
    const channelToAdd = channel.trim();
    if (channelToAdd && !formData.channels.includes(channelToAdd)) {
      setFormData(prev => ({
        ...prev,
        channels: [...prev.channels, channelToAdd]
      }));
      setNewChannel('');
    }
  };

  const handleRemoveChannel = (channelToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.filter(channel => channel !== channelToRemove)
    }));
  };

  const handleSave = () => {
    if (!campaign) return;

    // Basic validation
    if (!formData.name.trim()) {
      toast.error('Campaign name is required');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Start and end dates are required');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    if (formData.budget <= 0) {
      toast.error('Budget must be greater than 0');
      return;
    }

    const updatedCampaign: Campaign = {
      ...campaign,
      name: formData.name,
      description: formData.description,
      type: formData.type as Campaign['type'],
      status: formData.status as Campaign['status'],
      budget: Number(formData.budget),
      startDate: formData.startDate,
      endDate: formData.endDate,
      targetAudience: formData.targetAudience,
      channels: formData.channels
    };

    if (onSave) {
      onSave(updatedCampaign);
    }
    
    toast.success('Campaign updated successfully!');
    onClose();
  };

  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Campaign</h2>
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
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe the campaign objectives and strategy..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Audience *
                </label>
                <textarea
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Define your target audience demographics and characteristics..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Campaign Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Campaign['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {campaignTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Campaign['status'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {campaignStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget</h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Budget *
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount Spent
                  </label>
                  <div className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                    {formatCurrency(campaign.spent)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Remaining Budget
                  </label>
                  <div className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                    {formatCurrency(Math.max(0, formData.budget - campaign.spent))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Channels */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Marketing Channels</h3>
            <div className="space-y-4">
              {/* Quick Add Predefined Channels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quick Add Channels
                </label>
                <div className="flex flex-wrap gap-2">
                  {predefinedChannels.map((channel) => (
                    <button
                      key={channel}
                      onClick={() => handleAddChannel(channel)}
                      disabled={formData.channels.includes(channel)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        formData.channels.includes(channel)
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Channel Input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddChannel()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add custom channel..."
                />
                <button
                  onClick={() => handleAddChannel()}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Selected Channels */}
              {formData.channels.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected Channels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.channels.map((channel, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 text-sm rounded-full"
                      >
                        <span>{channel}</span>
                        <button
                          onClick={() => handleRemoveChannel(channel)}
                          className="p-1 hover:bg-purple-200 dark:hover:bg-purple-800/20 rounded-full"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCampaignModal;

