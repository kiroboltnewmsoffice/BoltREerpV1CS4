import React, { useState } from 'react';
import { X, BookOpen, Calendar, User, Award, Clock, FileText, Download } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface TrainingRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  onAddTrainingRecord: (employeeId: string, record: any) => void;
}

const TrainingRecordsModal: React.FC<TrainingRecordsModalProps> = ({ 
  isOpen, 
  onClose, 
  employee,
  onAddTrainingRecord 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [activeTab, setActiveTab] = useState('records');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    trainingType: '',
    trainingTitle: '',
    provider: '',
    startDate: '',
    endDate: '',
    duration: '',
    status: 'completed',
    certificateNumber: '',
    expiryDate: '',
    score: '',
    skillsAcquired: '',
    notes: ''
  });

  const trainingTypes = [
    { value: 'technical', label: 'Technical Skills' },
    { value: 'soft_skills', label: 'Soft Skills' },
    { value: 'compliance', label: 'Compliance Training' },
    { value: 'safety', label: 'Safety Training' },
    { value: 'leadership', label: 'Leadership Development' },
    { value: 'certification', label: 'Professional Certification' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  // Sample training records
  const trainingHistory = [
    {
      id: '1',
      type: 'Technical Skills',
      title: 'React Advanced Patterns',
      provider: 'Tech Academy',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      duration: '40 hours',
      status: 'completed',
      certificateNumber: 'CERT-2024-001',
      expiryDate: '2026-02-15',
      score: '95%',
      skillsAcquired: 'React Hooks, Context API, Performance Optimization'
    },
    {
      id: '2',
      type: 'Soft Skills',
      title: 'Leadership and Communication',
      provider: 'Business Institute',
      startDate: '2024-03-01',
      endDate: '2024-03-03',
      duration: '24 hours',
      status: 'completed',
      certificateNumber: 'CERT-2024-002',
      score: '88%',
      skillsAcquired: 'Team Leadership, Effective Communication, Conflict Resolution'
    },
    {
      id: '3',
      type: 'Compliance Training',
      title: 'Data Protection and Privacy',
      provider: 'Internal Training',
      startDate: '2024-04-10',
      endDate: '2024-04-10',
      duration: '4 hours',
      status: 'completed',
      certificateNumber: 'COMP-2024-001',
      expiryDate: '2025-04-10',
      score: '100%',
      skillsAcquired: 'GDPR Compliance, Data Security Best Practices'
    },
    {
      id: '4',
      type: 'Professional Certification',
      title: 'Project Management Professional (PMP)',
      provider: 'PMI',
      startDate: '2024-05-01',
      endDate: '2024-06-15',
      duration: '120 hours',
      status: 'in_progress',
      skillsAcquired: 'Project Planning, Risk Management, Quality Control'
    }
  ];

  // Training requirements/recommendations
  const trainingRequirements = [
    {
      id: '1',
      title: 'Annual Security Training',
      type: 'Compliance',
      dueDate: '2024-12-31',
      status: 'required',
      description: 'Mandatory annual cybersecurity awareness training'
    },
    {
      id: '2',
      title: 'Advanced TypeScript',
      type: 'Technical',
      dueDate: '2024-08-15',
      status: 'recommended',
      description: 'Enhance TypeScript skills for better code quality'
    },
    {
      id: '3',
      title: 'Team Management Workshop',
      type: 'Leadership',
      dueDate: '2024-09-30',
      status: 'recommended',
      description: 'Development opportunity for senior role preparation'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.trainingTitle || !formData.provider || !formData.startDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const record = {
      id: Date.now().toString(),
      employeeId: employee.id,
      type: trainingTypes.find(t => t.value === formData.trainingType)?.label || formData.trainingType,
      title: formData.trainingTitle,
      provider: formData.provider,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration: formData.duration,
      status: formData.status,
      certificateNumber: formData.certificateNumber,
      expiryDate: formData.expiryDate,
      score: formData.score,
      skillsAcquired: formData.skillsAcquired,
      notes: formData.notes,
      addedAt: new Date().toISOString()
    };

    onAddTrainingRecord(employee.id, record);
    toast.success('Training record added successfully');
    setShowAddForm(false);
    setFormData({
      trainingType: '',
      trainingTitle: '',
      provider: '',
      startDate: '',
      endDate: '',
      duration: '',
      status: 'completed',
      certificateNumber: '',
      expiryDate: '',
      score: '',
      skillsAcquired: '',
      notes: ''
    });
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  const getRequirementColor = (status: string) => {
    switch (status) {
      case 'required': return 'bg-red-100 text-red-800 border-red-200';
      case 'recommended': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'optional': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen || !employee) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Training Records</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {employee.name} • {employee.role} • {employee.department}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('records')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'records'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Training History
            </button>
            <button
              onClick={() => setActiveTab('requirements')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'requirements'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Requirements
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'certificates'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Certificates
            </button>
          </div>

          {/* Training Records Tab */}
          {activeTab === 'records' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Training History</h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showAddForm ? 'Cancel' : 'Add Training Record'}
                </button>
              </div>

              {showAddForm && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Add New Training Record</h4>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Training Type *
                        </label>
                        <select
                          name="trainingType"
                          value={formData.trainingType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select type</option>
                          {trainingTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Training Title *
                        </label>
                        <input
                          type="text"
                          name="trainingTitle"
                          value={formData.trainingTitle}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Provider *
                        </label>
                        <input
                          type="text"
                          name="provider"
                          value={formData.provider}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duration
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., 40 hours, 3 days"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {statusOptions.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Certificate Number
                        </label>
                        <input
                          type="text"
                          name="certificateNumber"
                          value={formData.certificateNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Score/Grade
                        </label>
                        <input
                          type="text"
                          name="score"
                          value={formData.score}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="e.g., 95%, A+"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Skills Acquired
                      </label>
                      <textarea
                        name="skillsAcquired"
                        value={formData.skillsAcquired}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="List the key skills and knowledge gained"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Additional notes or comments"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add Record
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {trainingHistory.map(record => (
                  <div key={record.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{record.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.type} • {record.provider}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{record.startDate} {record.endDate && `- ${record.endDate}`}</span>
                      </div>
                      {record.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{record.duration}</span>
                        </div>
                      )}
                      {record.score && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-gray-400" />
                          <span>Score: {record.score}</span>
                        </div>
                      )}
                      {record.certificateNumber && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>{record.certificateNumber}</span>
                        </div>
                      )}
                    </div>

                    {record.skillsAcquired && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-1">Skills Acquired:</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.skillsAcquired}</p>
                      </div>
                    )}

                    {record.expiryDate && (
                      <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                        Certificate expires: {record.expiryDate}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements Tab */}
          {activeTab === 'requirements' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Training Requirements & Recommendations</h3>
              
              {trainingRequirements.map(requirement => (
                <div key={requirement.id} className={`border-l-4 rounded-lg p-4 ${getRequirementColor(requirement.status)}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{requirement.title}</h4>
                      <p className="text-sm mt-1">{requirement.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span>Type: {requirement.type}</span>
                        <span>Due: {requirement.dueDate}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-medium">
                      {requirement.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Certificates</h3>
              
              {trainingHistory.filter(record => record.certificateNumber).map(cert => (
                <div key={cert.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{cert.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{cert.provider}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Certificate: {cert.certificateNumber}</p>
                      {cert.expiryDate && (
                        <p className="text-sm text-orange-600 dark:text-orange-400">Expires: {cert.expiryDate}</p>
                      )}
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingRecordsModal;
