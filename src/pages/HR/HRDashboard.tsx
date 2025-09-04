import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  DollarSign,
  FileText,
  Eye,
  Edit
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import AddEmployeeModal from '../../components/Modals/AddEmployeeModal';
import ViewEmployeeModal from '../../components/Modals/ViewEmployeeModal';
import EditEmployeeModal from '../../components/Modals/EditEmployeeModal';
import DropdownMenu from '../../components/DropdownMenu';
import { formatCurrency } from '../../utils/currency';

const HRDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Sample employees data
  const employees = [
    {
      id: '1',
      employeeId: 'EMP001',
      name: 'Ahmed Mohamed',
      email: 'ahmed.mohamed@company.com',
      phone: '+20-10-123-4567',
      position: 'Senior Sales Manager',
      department: 'Sales',
      salary: 25000,
      hireDate: '2023-01-15',
      status: 'active' as const,
      manager: 'Mike Wilson',
      skills: ['Sales', 'Negotiation', 'Customer Relations'],
      performance: 92
    },
    {
      id: '2',
      employeeId: 'EMP002',
      name: 'Fatima Hassan',
      email: 'fatima.hassan@company.com',
      phone: '+20-11-987-6543',
      position: 'Financial Analyst',
      department: 'Finance',
      salary: 18000,
      hireDate: '2023-03-20',
      status: 'active' as const,
      manager: 'Sarah Johnson',
      skills: ['Financial Analysis', 'Excel', 'Reporting'],
      performance: 88
    },
    {
      id: '3',
      employeeId: 'EMP003',
      name: 'Omar Ali',
      email: 'omar.ali@company.com',
      phone: '+20-12-555-7890',
      position: 'Project Coordinator',
      department: 'Operations',
      salary: 15000,
      hireDate: '2023-06-10',
      status: 'active' as const,
      skills: ['Project Management', 'Communication', 'Planning'],
      performance: 85
    }
  ];

  const leaveRequests = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Ahmed Mohamed',
      type: 'annual',
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      days: 5,
      reason: 'Family vacation',
      status: 'pending' as const,
      submittedAt: '2024-01-25'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Fatima Hassan',
      type: 'sick',
      startDate: '2024-01-26',
      endDate: '2024-01-26',
      days: 1,
      reason: 'Medical appointment',
      status: 'approved' as const,
      submittedAt: '2024-01-25'
    }
  ];

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-blue-600';
    if (performance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleViewEmployee = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setShowViewModal(true);
    }
  };

  const handleEditEmployee = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setShowEditModal(true);
    }
  };

  const handleMoreOptions = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      const options = [
        {
          label: 'View Performance',
          onClick: () => {
            toast.success(`Opening performance review for ${employee.name}`);
            // TODO: Open performance modal
          }
        },
        {
          label: 'Manage Leave',
          onClick: () => {
            toast.success(`Opening leave management for ${employee.name}`);
            // TODO: Open leave modal
          }
        },
        {
          label: 'Update Salary',
          onClick: () => {
            toast.success(`Opening salary update for ${employee.name}`);
            // TODO: Open salary modal
          }
        },
        {
          label: 'Training Records',
          onClick: () => {
            toast.success(`Opening training records for ${employee.name}`);
            // TODO: Open training modal
          }
        },
        {
          label: 'Employee Report',
          onClick: () => {
            toast.success(`Generating report for ${employee.name}`);
            // TODO: Generate report
          }
        },
        {
          label: 'Send Message',
          onClick: () => {
            toast.success(`Opening message composer for ${employee.name}`);
            // TODO: Open message modal
          }
        },
        {
          label: 'Archive Employee',
          onClick: () => {
            toast.success(`Archiving ${employee.name}`);
            // TODO: Archive employee
          }
        }
      ];
      
      return options;
    }
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Human Resources</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage employees, attendance, and HR operations</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          type="button"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Employees"
          value={employees.length}
          change="+3 new hires this month"
          changeType="positive"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Active Employees"
          value={employees.filter(e => e.status === 'active').length}
          change="Currently working"
          changeType="positive"
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Pending Leave Requests"
          value={leaveRequests.filter(l => l.status === 'pending').length}
          change="Require approval"
          changeType="neutral"
          icon={Calendar}
          color="yellow"
        />
        <StatsCard
          title="Average Performance"
          value={`${(employees.reduce((sum, e) => sum + e.performance, 0) / employees.length).toFixed(1)}%`}
          change="Team performance"
          changeType="positive"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          type="button"
        >
          <div className="flex items-center">
            <UserPlus className="h-8 w-8 text-blue-600 mr-3" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900 dark:text-white">Add Employee</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Register new team member</p>
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => {
            toast.success('Attendance tracker opened successfully!');
            // In a real app, this would navigate to attendance tracking page
          }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          type="button"
        >
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900 dark:text-white">Attendance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track daily attendance</p>
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => {
            toast.success('Leave requests system opened successfully!');
            // In a real app, this would navigate to leave requests page
          }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          type="button"
        >
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-purple-600 mr-3" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900 dark:text-white">Leave Request</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage time off</p>
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => {
            toast.success('Payroll system opened successfully!');
            // In a real app, this would navigate to payroll management page
          }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          type="button"
        >
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-yellow-600 mr-3" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900 dark:text-white">Payroll</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Process salaries</p>
            </div>
          </div>
        </button>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Employees ({filteredEmployees.length})
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              >
                <option value="all">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">Human Resources</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-white">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{employee.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{employee.position}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Since {employee.hireDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(employee.salary)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Monthly</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            employee.performance >= 90 ? 'bg-green-500' :
                            employee.performance >= 80 ? 'bg-blue-500' :
                            employee.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${employee.performance}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getPerformanceColor(employee.performance)}`}>
                        {employee.performance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewEmployee(employee.id)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        type="button"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditEmployee(employee.id)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        type="button"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <DropdownMenu
                        options={handleMoreOptions(employee.id)}
                        buttonClassName="text-gray-400 hover:text-gray-600 transition-colors"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Requests */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Leave Requests</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{request.employeeName}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {request.type.charAt(0).toUpperCase() + request.type.slice(1)} leave - {request.days} days
                    </p>
                    <p className="text-xs text-gray-400">{request.startDate} to {request.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          // In a real app, this would update the request status in the database
                          toast.success(`Leave request approved for ${request.employeeName}`);
                        }}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        type="button"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => {
                          // In a real app, this would update the request status in the database
                          toast.error(`Leave request rejected for ${request.employeeName}`);
                        }}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        type="button"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <AddEmployeeModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <ViewEmployeeModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        employee={selectedEmployee}
      />
      
      <EditEmployeeModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default HRDashboard;