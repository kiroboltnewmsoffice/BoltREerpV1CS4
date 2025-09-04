import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Download,
  Mail,
  MoreHorizontal
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import AddInvoiceModal from '../../components/Modals/AddInvoiceModal';
import ViewInvoiceModal from '../../components/Modals/ViewInvoiceModal';
import EditInvoiceModal from '../../components/Modals/EditInvoiceModal';
import { formatCurrency, formatCurrencyShort } from '../../utils/currency';
import { format } from 'date-fns';

const InvoicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);

  // Sample invoices data
  const invoices = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerId: '1',
      customerName: 'Ahmed Hassan',
      items: [
        { id: '1', description: 'Unit A-1201 - Down Payment', quantity: 1, unitPrice: 255000, total: 255000 },
        { id: '2', description: 'Registration Fees', quantity: 1, unitPrice: 15000, total: 15000 }
      ],
      subtotal: 270000,
      tax: 40500,
      discount: 0,
      total: 310500,
      currency: 'EGP',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'paid' as const,
      paymentTerms: '30 days',
      notes: 'Payment for unit purchase'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerId: '2',
      customerName: 'Fatima Al Zahra',
      items: [
        { id: '1', description: 'Consultation Services', quantity: 1, unitPrice: 5000, total: 5000 },
        { id: '2', description: 'Property Valuation', quantity: 1, unitPrice: 8000, total: 8000 }
      ],
      subtotal: 13000,
      tax: 1950,
      discount: 1000,
      total: 13950,
      currency: 'EGP',
      issueDate: '2024-01-20',
      dueDate: '2024-02-20',
      status: 'sent' as const,
      paymentTerms: '30 days',
      notes: 'Professional services invoice'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      customerId: '1',
      customerName: 'Ahmed Hassan',
      items: [
        { id: '1', description: 'Monthly Installment - January', quantity: 1, unitPrice: 127500, total: 127500 }
      ],
      subtotal: 127500,
      tax: 19125,
      discount: 0,
      total: 146625,
      currency: 'EGP',
      issueDate: '2024-01-25',
      dueDate: '2024-02-25',
      status: 'overdue' as const,
      paymentTerms: '30 days',
      notes: 'Monthly payment installment'
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'sent': return Send;
      case 'draft': return Receipt;
      case 'overdue': return AlertTriangle;
      case 'cancelled': return AlertTriangle;
      default: return Clock;
    }
  };

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const outstandingAmount = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, i) => sum + i.total, 0);

  const handleMoreInvoiceOptions = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
      const options = [
        'Duplicate Invoice',
        'Convert to Credit Note',
        'Send Reminder',
        'Mark as Paid',
        'Apply Discount',
        'Add Payment Plan',
        'Archive Invoice'
      ];
      
      const optionsMenu = document.createElement('div');
      optionsMenu.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      optionsMenu.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoice Actions</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${invoice.invoiceNumber} - ${invoice.customerName}</p>
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
            toast.success(`${options[actionIndex]} selected for ${invoice.invoiceNumber}`);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create, send, and track customer invoices</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => {
              const csvData = filteredInvoices.map(i => ({
                'Invoice Number': i.invoiceNumber,
                'Customer': i.customerName,
                'Total Amount': i.total,
                'Issue Date': i.issueDate,
                'Due Date': i.dueDate,
                'Status': i.status,
                'Payment Terms': i.paymentTerms
              }));
              
              const csvContent = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `invoices-report-${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
              toast.success('Invoices exported successfully!');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            type="button"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Invoices"
          value={totalInvoices}
          change="This month"
          changeType="neutral"
          icon={Receipt}
          color="blue"
        />
        <StatsCard
          title="Paid Invoices"
          value={paidInvoices}
          change={`${((paidInvoices / totalInvoices) * 100).toFixed(1)}% collection rate`}
          changeType="positive"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Overdue"
          value={overdueInvoices}
          change="Require follow-up"
          changeType="negative"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Outstanding Amount"
          value={formatCurrencyShort(outstandingAmount)}
          change="Pending collection"
          changeType="neutral"
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Invoices ({filteredInvoices.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
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
              {filteredInvoices.map((invoice) => {
                const StatusIcon = getStatusIcon(invoice.status);
                const isOverdue = invoice.status === 'overdue';
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{invoice.items.length} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{invoice.customerName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{invoice.paymentTerms}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(invoice.total)}
                      </div>
                      {invoice.tax > 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          +{formatCurrency(invoice.tax)} tax
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                        {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                      </div>
                      {isOverdue && (
                        <div className="text-xs text-red-500">Overdue</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="h-4 w-4 mr-2" />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowViewModal(true);
                          }}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          type="button"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingInvoice(invoice);
                            setShowEditModal(true);
                          }}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          type="button"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => toast.success(`Downloading invoice: ${invoice.invoiceNumber}`)}
                          className="text-gray-400 hover:text-purple-600 transition-colors"
                          type="button"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => toast.success(`Emailing invoice: ${invoice.invoiceNumber}`)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          type="button"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleMoreInvoiceOptions(invoice.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          type="button"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <AddInvoiceModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <ViewInvoiceModal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        invoice={selectedInvoice}
      />
      
      {editingInvoice && (
        <EditInvoiceModal
          invoice={editingInvoice}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingInvoice(null);
          }}
          onSave={(updatedInvoice) => {
            console.log('Updated invoice:', updatedInvoice);
            // TODO: Update invoice in the data store
            toast.success('Invoice updated successfully');
            setShowEditModal(false);
            setEditingInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default InvoicesPage;