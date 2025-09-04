import React, { useState } from 'react';
import { X, FileText, Users, Mail, Phone, Calendar, Download, Eye, Share2, Printer, Plus, Filter } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface MarketingMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

const MarketingMaterialsModal: React.FC<MarketingMaterialsModalProps> = ({ 
  isOpen, 
  onClose, 
  property 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [activeTab, setActiveTab] = useState('brochures');
  const [filterType, setFilterType] = useState('all');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  // Sample marketing materials data
  const marketingMaterials = {
    brochures: [
      {
        id: '1',
        name: 'Luxury Apartment Brochure',
        type: 'brochure',
        format: 'PDF',
        size: '2.4 MB',
        language: 'English',
        createdDate: '2025-01-10',
        lastUpdated: '2025-01-15',
        status: 'published',
        downloads: 156,
        views: 432,
        description: 'Premium full-color brochure showcasing luxury amenities and floor plans',
        thumbnail: '/api/placeholder/200/150',
        url: '/marketing/brochures/luxury-apartment-brochure.pdf'
      },
      {
        id: '2',
        name: 'Floor Plans Collection',
        type: 'floor-plans',
        format: 'PDF',
        size: '5.1 MB',
        language: 'English',
        createdDate: '2025-01-08',
        lastUpdated: '2025-01-12',
        status: 'published',
        downloads: 89,
        views: 267,
        description: 'Detailed floor plans for all available units with measurements',
        thumbnail: '/api/placeholder/200/150',
        url: '/marketing/floor-plans/collection.pdf'
      },
      {
        id: '3',
        name: 'Virtual Tour Guide',
        type: 'digital',
        format: 'Interactive',
        size: '15.2 MB',
        language: 'English',
        createdDate: '2025-01-05',
        lastUpdated: '2025-01-14',
        status: 'published',
        downloads: 234,
        views: 1456,
        description: '360° virtual tour with interactive hotspots and information panels',
        thumbnail: '/api/placeholder/200/150',
        url: '/virtual-tours/luxury-apartment'
      }
    ],
    flyers: [
      {
        id: '4',
        name: 'Open House Flyer',
        type: 'flyer',
        format: 'PDF',
        size: '1.8 MB',
        language: 'English',
        createdDate: '2025-01-12',
        lastUpdated: '2025-01-12',
        status: 'published',
        downloads: 67,
        views: 189,
        description: 'Single-page flyer for open house events with key highlights',
        thumbnail: '/api/placeholder/200/150',
        url: '/marketing/flyers/open-house.pdf'
      },
      {
        id: '5',
        name: 'Price List & Incentives',
        type: 'pricing',
        format: 'PDF',
        size: '986 KB',
        language: 'English',
        createdDate: '2025-01-11',
        lastUpdated: '2025-01-16',
        status: 'published',
        downloads: 123,
        views: 345,
        description: 'Current pricing with available incentives and financing options',
        thumbnail: '/api/placeholder/200/150',
        url: '/marketing/pricing/current-rates.pdf'
      }
    ],
    digital: [
      {
        id: '6',
        name: 'Property Website',
        type: 'website',
        format: 'Web',
        language: 'English',
        createdDate: '2025-01-01',
        lastUpdated: '2025-01-16',
        status: 'live',
        downloads: 0,
        views: 2345,
        description: 'Dedicated property website with photo gallery and contact forms',
        thumbnail: '/api/placeholder/200/150',
        url: 'https://luxury-apartments.property.com'
      },
      {
        id: '7',
        name: 'Social Media Kit',
        type: 'social-media',
        format: 'ZIP',
        size: '24.7 MB',
        language: 'English',
        createdDate: '2025-01-09',
        lastUpdated: '2025-01-14',
        status: 'published',
        downloads: 45,
        views: 156,
        description: 'Complete social media package with images, videos, and copy',
        thumbnail: '/api/placeholder/200/150',
        url: '/marketing/social-media/luxury-apartments-kit.zip'
      },
      {
        id: '8',
        name: 'Email Campaign Template',
        type: 'email-template',
        format: 'HTML',
        size: '456 KB',
        language: 'English',
        createdDate: '2025-01-07',
        lastUpdated: '2025-01-13',
        status: 'published',
        downloads: 34,
        views: 98,
        description: 'Responsive email template for property marketing campaigns',
        thumbnail: '/api/placeholder/200/150',
        url: '/marketing/email-templates/property-campaign.html'
      }
    ],
    presentations: [
      {
        id: '9',
        name: 'Investment Presentation',
        type: 'presentation',
        format: 'PowerPoint',
        size: '8.9 MB',
        language: 'English',
        createdDate: '2025-01-06',
        lastUpdated: '2025-01-15',
        status: 'published',
        downloads: 78,
        views: 234,
        description: 'Comprehensive presentation for potential investors and partners',
        thumbnail: '/api/placeholder/200/150',
        url: '/marketing/presentations/investment-deck.pptx'
      },
      {
        id: '10',
        name: 'Sales Team Training',
        type: 'training',
        format: 'PowerPoint',
        size: '12.3 MB',
        language: 'English',
        createdDate: '2025-01-04',
        lastUpdated: '2025-01-11',
        status: 'internal',
        downloads: 23,
        views: 67,
        description: 'Training materials for sales team with talking points and objection handling',
        thumbnail: '/api/placeholder/200/150',
        url: '/internal/training/sales-training.pptx'
      }
    ]
  };

  const tabs = [
    { id: 'brochures', label: 'Brochures & Catalogs', icon: FileText, count: marketingMaterials.brochures.length },
    { id: 'flyers', label: 'Flyers & Sheets', icon: FileText, count: marketingMaterials.flyers.length },
    { id: 'digital', label: 'Digital Assets', icon: Share2, count: marketingMaterials.digital.length },
    { id: 'presentations', label: 'Presentations', icon: Users, count: marketingMaterials.presentations.length }
  ];

  const materialTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'brochure', label: 'Brochures' },
    { value: 'floor-plans', label: 'Floor Plans' },
    { value: 'flyer', label: 'Flyers' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'digital', label: 'Digital' },
    { value: 'website', label: 'Websites' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'email-template', label: 'Email Templates' },
    { value: 'presentation', label: 'Presentations' },
    { value: 'training', label: 'Training' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'live': return 'bg-emerald-100 text-emerald-800';
      case 'internal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf': return '📄';
      case 'powerpoint': return '📊';
      case 'html': return '🌐';
      case 'zip': return '📦';
      case 'interactive': return '🎮';
      case 'web': return '🌍';
      default: return '📄';
    }
  };

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleSelectAll = () => {
    const currentMaterials = marketingMaterials[activeTab as keyof typeof marketingMaterials];
    const allIds = currentMaterials.map(m => m.id);
    setSelectedMaterials(selectedMaterials.length === allIds.length ? [] : allIds);
  };

  const handleBulkDownload = () => {
    if (selectedMaterials.length === 0) return;
    console.log('Downloading materials:', selectedMaterials);
    // Implement bulk download logic
  };

  const handleBulkShare = () => {
    if (selectedMaterials.length === 0) return;
    console.log('Sharing materials:', selectedMaterials);
    // Implement bulk share logic
  };

  const getCurrentMaterials = () => {
    const materials = marketingMaterials[activeTab as keyof typeof marketingMaterials];
    if (filterType === 'all') return materials;
    return materials.filter(material => material.type === filterType);
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  if (!isOpen || !property) return null;

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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Marketing Materials
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {property.name} • {getCurrentMaterials().length} materials • {selectedMaterials.length} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Property Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Property:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{property.name}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{property.type}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Location:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{property.location}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Price:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{property.price}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {materialTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {selectedMaterials.length === getCurrentMaterials().length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {selectedMaterials.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkDownload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download ({selectedMaterials.length})
                  </button>
                  <button
                    onClick={handleBulkShare}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Materials Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentMaterials().map(material => (
                <div key={material.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Material Header */}
                  <div className="relative">
                    <div className="h-32 bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-4xl">{getFormatIcon(material.format)}</span>
                    </div>
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material.id)}
                        onChange={() => handleMaterialSelect(material.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(material.status)}`}>
                        {material.status.charAt(0).toUpperCase() + material.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Material Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{material.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{material.description}</p>
                    
                    <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="font-medium">{material.format}</span>
                      </div>
                      {material.size && (
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span className="font-medium">{material.size}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Updated:</span>
                        <span className="font-medium">{formatDate(material.lastUpdated)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Views:</span>
                        <span className="font-medium">{material.views.toLocaleString()}</span>
                      </div>
                      {material.downloads > 0 && (
                        <div className="flex justify-between">
                          <span>Downloads:</span>
                          <span className="font-medium">{material.downloads.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
                        <Download className="w-3 h-3" />
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
                        <Share2 className="w-3 h-3" />
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
                        <Printer className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getCurrentMaterials().length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No materials found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {filterType !== 'all' ? 'No materials match your filter criteria.' : 'No marketing materials available for this property.'}
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  Create Material
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(marketingMaterials).flat().length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Materials</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Object.values(marketingMaterials).flat().reduce((sum, m) => sum + m.downloads, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Object.values(marketingMaterials).flat().reduce((sum, m) => sum + m.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Object.values(marketingMaterials).flat().filter(m => m.status === 'published').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingMaterialsModal;
