import React from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, Target, TrendingUp, MessageSquare } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number;
  dateCreated: string;
  lastContact?: string;
  assignedTo?: string;
  company?: string;
  address?: string;
  interest?: string;
  budget?: number;
  timeline?: string;
  notes?: string;
  interactions?: {
    type: 'call' | 'email' | 'meeting' | 'message';
    date: string;
    description: string;
  }[];
}

interface ViewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const ViewLeadModal: React.FC<ViewLeadModalProps> = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Hot';
    if (score >= 60) return 'Warm';
    if (score >= 40) return 'Cool';
    return 'Cold';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" 
        role="dialog" 
        aria-modal="true" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Lead Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{lead.name}</p>
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
          {/* Lead Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Overview</h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{lead.name}</h4>
                    {lead.company && (
                      <p className="text-gray-600 dark:text-gray-400">{lead.company}</p>
                    )}
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Score:</span>
                        <span className={`font-semibold ${getScoreColor(lead.score)}`}>
                          {lead.score}% ({getScoreLabel(lead.score)})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{lead.source}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">{lead.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-gray-900 dark:text-white">{lead.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(lead.dateCreated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {lead.assignedTo && (
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
                      <p className="text-gray-900 dark:text-white">{lead.assignedTo}</p>
                    </div>
                  </div>
                )}

                {lead.lastContact && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last Contact</p>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(lead.lastContact).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {lead.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                      <p className="text-gray-900 dark:text-white text-sm">{lead.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Interest & Requirements</h4>
                <div className="space-y-3">
                  {lead.interest && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Interest</p>
                      <p className="text-gray-900 dark:text-white">{lead.interest}</p>
                    </div>
                  )}
                  {lead.budget && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Budget Range</p>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        ${lead.budget.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {lead.timeline && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Timeline</p>
                      <p className="text-gray-900 dark:text-white">{lead.timeline}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Lead Score Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Engagement</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-500 rounded-full" 
                          style={{ width: `${Math.min(lead.score * 0.4, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round(lead.score * 0.4)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fit</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="h-2 bg-green-500 rounded-full" 
                          style={{ width: `${Math.min(lead.score * 0.3, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round(lead.score * 0.3)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Intent</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="h-2 bg-yellow-500 rounded-full" 
                          style={{ width: `${Math.min(lead.score * 0.3, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round(lead.score * 0.3)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{lead.notes}</p>
              </div>
            </div>
          )}

          {/* Interaction History */}
          {lead.interactions && lead.interactions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interaction History</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="space-y-4">
                  {lead.interactions.map((interaction, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex-shrink-0">
                        {interaction.type === 'call' && <Phone className="h-5 w-5 text-blue-600" />}
                        {interaction.type === 'email' && <Mail className="h-5 w-5 text-green-600" />}
                        {interaction.type === 'meeting' && <Calendar className="h-5 w-5 text-purple-600" />}
                        {interaction.type === 'message' && <MessageSquare className="h-5 w-5 text-yellow-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {interaction.type}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(interaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{interaction.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Lead Score</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{lead.score}%</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Days Active</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {Math.floor((new Date().getTime() - new Date(lead.dateCreated).getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Interactions</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {lead.interactions?.length || 0}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Potential Value</p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                      ${lead.budget ? (lead.budget * (lead.score / 100)).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
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

export default ViewLeadModal;

