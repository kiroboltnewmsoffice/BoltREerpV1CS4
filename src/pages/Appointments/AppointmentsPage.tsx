import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  User,
  Building,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Phone
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ScheduleAppointmentModal from '../../components/Modals/ScheduleAppointmentModal';
import ViewAppointmentModal from '../../components/Modals/ViewAppointmentModal';
import EditAppointmentModal from '../../components/Modals/EditAppointmentModal';

const AppointmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Sample appointments data
  const appointments = [
    {
      id: '1',
      title: 'Property Viewing - Cairo Heights',
      description: 'Show unit A-1201 to potential buyer',
      customerId: '1',
      customerName: 'Ahmed Hassan',
      employeeId: '3',
      employeeName: 'Mike Wilson',
      propertyId: '1',
      propertyName: 'Cairo Heights',
      startTime: '2024-01-26T10:00:00',
      endTime: '2024-01-26T11:00:00',
      location: 'New Cairo, Unit A-1201',
      type: 'viewing' as const,
      status: 'scheduled' as const,
      notes: 'Customer interested in 2-bedroom units',
      reminders: ['30 minutes before', '1 day before']
    },
    {
      id: '2',
      title: 'Contract Signing Meeting',
      description: 'Final contract signing for unit purchase',
      customerId: '2',
      customerName: 'Fatima Al Zahra',
      employeeId: '2',
      employeeName: 'Sarah Johnson',
      startTime: '2024-01-27T14:00:00',
      endTime: '2024-01-27T15:30:00',
      location: 'Main Office - Conference Room A',
      type: 'meeting' as const,
      status: 'confirmed' as const,
      notes: 'Bring all legal documents and payment receipts',
      reminders: ['1 hour before', '1 day before']
    },
    {
      id: '3',
      title: 'Property Inspection',
      description: 'Technical inspection of completed units',
      employeeId: '4',
      employeeName: 'Omar Ali',
      propertyId: '2',
      propertyName: 'Business Central',
      startTime: '2024-01-28T09:00:00',
      endTime: '2024-01-28T12:00:00',
      location: 'Downtown Cairo - Business Central',
      type: 'inspection' as const,
      status: 'scheduled' as const,
      notes: 'Quality check before handover',
      reminders: ['2 hours before']
    }
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'viewing': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'consultation': return 'bg-green-100 text-green-800';
      case 'inspection': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter(a => 
    format(new Date(a.startTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ).length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length;

  // Modal handlers
  const handleViewAppointment = (appointment: typeof appointments[0]) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const handleEditAppointment = (appointment: typeof appointments[0]) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleSaveAppointment = (updatedAppointment: any) => {
    console.log('Updated appointment:', updatedAppointment);
    toast.success('Appointment updated successfully!');
    // In a real app, update the appointment in the data store
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointment Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Schedule and manage customer appointments and meetings</p>
        </div>
        <button 
          onClick={() => setShowScheduleModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Appointments"
          value={totalAppointments}
          change="This month"
          changeType="neutral"
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Today's Appointments"
          value={todayAppointments}
          change="Scheduled today"
          changeType="neutral"
          icon={Clock}
          color="green"
        />
        <StatsCard
          title="Completed"
          value={completedAppointments}
          change={`${((completedAppointments / totalAppointments) * 100).toFixed(1)}% completion rate`}
          changeType="positive"
          icon={CheckCircle}
          color="purple"
        />
        <StatsCard
          title="Pending"
          value={pendingAppointments}
          change="Upcoming"
          changeType="neutral"
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Calendar View Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => toast.info('Switched to List View')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              type="button"
            >
              List View
            </button>
            <button 
              onClick={() => toast.info('Switched to Calendar View')}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              type="button"
            >
              Calendar View
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="viewing">Property Viewing</option>
              <option value="meeting">Meeting</option>
              <option value="consultation">Consultation</option>
              <option value="inspection">Inspection</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appointments ({filteredAppointments.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{appointment.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(appointment.type)}`}>
                      {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{appointment.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-900 dark:text-white">
                          {format(new Date(appointment.startTime), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {format(new Date(appointment.startTime), 'HH:mm')} - {format(new Date(appointment.endTime), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-900 dark:text-white">{appointment.location}</div>
                      </div>
                    </div>
                    
                    {appointment.customerName && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="text-gray-900 dark:text-white">{appointment.customerName}</div>
                          <div className="text-gray-500 dark:text-gray-400">Customer</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-gray-900 dark:text-white">{appointment.employeeName}</div>
                        <div className="text-gray-500 dark:text-gray-400">Assigned</div>
                      </div>
                    </div>
                  </div>
                  
                  {appointment.propertyName && (
                    <div className="flex items-center mt-2 text-sm">
                      <Building className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Property: {appointment.propertyName}</span>
                    </div>
                  )}
                  
                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {appointment.status === 'scheduled' && (
                    <button 
                      onClick={() => toast(`Viewing appointment: ${appointment.title}`)}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      type="button"
                    >
                      Confirm
                    </button>
                  )}
                  <button 
                    onClick={() => handleViewAppointment(appointment)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEditAppointment(appointment)}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                    type="button"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => toast.success(`Calling ${appointment.customerName || 'contact'}`)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    type="button"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <ScheduleAppointmentModal 
        isOpen={showScheduleModal} 
        onClose={() => setShowScheduleModal(false)} 
      />
      
      <ViewAppointmentModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        appointment={selectedAppointment}
      />
      
      <EditAppointmentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        appointment={selectedAppointment}
        onSave={handleSaveAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;