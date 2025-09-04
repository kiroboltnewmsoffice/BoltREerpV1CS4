import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Building,
  Plus,
  Search,
  Filter,
  MapPin,
  Home,
  Users,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import StatsCard from '../../components/Dashboard/StatsCard';
import AddPropertyModal from '../../components/Modals/AddPropertyModal';
import ViewPropertyModal from '../../components/Modals/ViewPropertyModal';
import EditPropertyModal from '../../components/Modals/EditPropertyModal';
import { formatCurrency, formatCurrencyShort } from '../../utils/currency';

const PropertiesPage: React.FC = () => {
  const { properties, units } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => `EGP ${amount.toLocaleString()}`;

  // Calculate stats
  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
  const availableUnits = properties.reduce((sum, p) => sum + p.availableUnits, 0);
  const soldUnits = properties.reduce((sum, p) => sum + p.soldUnits, 0);
  const totalValue = units.reduce((sum, u) => sum + u.price, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'construction': return 'bg-yellow-100 text-yellow-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'commercial' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const handleAddProperty = () => {
    setShowAddModal(true);
  };

  const handleViewUnits = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      toast.success(`Viewing units for: ${property.name}`);
    }
  };

  const handleViewProperty = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowViewModal(true);
    }
  };

  const handleEditProperty = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setShowEditModal(true);
    }
  };

  const handleMoreOptions = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      const options = [
        'View Units',
        'Add Unit',
        'Property Report',
        'Marketing Materials',
        'Price History',
        'Duplicate Property',
        'Archive Property'
      ];
      const selectedOption = window.prompt(`Select an option for ${property.name}:\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`);
      if (selectedOption) {
        toast.success(`${options[parseInt(selectedOption) - 1] || 'Option'} selected for ${property.name}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your property portfolio and inventory</p>
        </div>
        <button 
          onClick={handleAddProperty}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Properties"
          value={totalProperties}
          change="+2 new this month"
          changeType="positive"
          icon={Building}
          color="blue"
        />
        <StatsCard
          title="Total Units"
          value={totalUnits}
          change={`${availableUnits} available`}
          changeType="neutral"
          icon={Home}
          color="green"
        />
        <StatsCard
          title="Units Sold"
          value={soldUnits}
          change={`${((soldUnits / totalUnits) * 100).toFixed(1)}% sold`}
          changeType="positive"
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Portfolio Value"
          value={formatCurrencyShort(totalValue)}
          change="Total market value"
          changeType="neutral"
          icon={DollarSign}
          color="green"
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
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="construction">Construction</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
            </select>
            
            <button 
              onClick={() => console.log('Filter options clicked')}
              className="p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              type="button"
            >
              <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Property Image */}
            <div className="aspect-video bg-gray-200 dark:bg-gray-700">
              {property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {property.name}
                  </h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(property.type)}`}>
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {property.description}
              </p>

              {/* Property Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {property.totalUnits}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Units</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {property.availableUnits}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span>Sales Progress</span>
                  <span>{((property.soldUnits / property.totalUnits) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(property.soldUnits / property.totalUnits) * 100}%` }}
                  />
                </div>
              </div>

              {/* Base Price */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Starting from</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(property.basePrice)}
                </span>
              </div>

              {/* Completion Date */}
              {property.completionDate && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Expected completion: {property.completionDate}
                </div>
              )}

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded">
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded">
                        +{property.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => handleViewUnits(property.id)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  type="button"
                >
                  View Units
                </button>
                <button 
                  onClick={() => handleViewProperty(property.id)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  type="button"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleEditProperty(property.id)}
                  className="text-gray-400 hover:text-green-600 transition-colors"
                  type="button"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleMoreOptions(property.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  type="button"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No properties found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search criteria or add a new property.</p>
          <button 
            onClick={handleAddProperty}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            type="button"
          >
            Add New Property
          </button>
        </div>
      )}
      
      <AddPropertyModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <ViewPropertyModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        property={selectedProperty}
      />
      
      <EditPropertyModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        property={selectedProperty}
      />
    </div>
  );
};

export default PropertiesPage;