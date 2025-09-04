import { create } from 'zustand';
import { Customer, Property, Unit, Transaction, PaymentPlan, Contract, Notification, Task } from '../types';

interface DataState {
  customers: Customer[];
  properties: Property[];
  units: Unit[];
  transactions: Transaction[];
  paymentPlans: PaymentPlan[];
  contracts: Contract[];
  notifications: Notification[];
  tasks: Task[];
  employees: any[];
  projects: any[];
  suppliers: any[];
  inventory: any[];
  invoices: any[];
  
  // Actions
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  addProperty: (property: Omit<Property, 'id'>) => void;
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  markNotificationRead: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addContract: (contract: Omit<Contract, 'id'>) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  addEmployee: (employee: any) => void;
  updateEmployee: (id: string, updates: any) => void;
  addProject: (project: any) => void;
  updateProject: (id: string, updates: any) => void;
  addSupplier: (supplier: any) => void;
  updateSupplier: (id: string, updates: any) => void;
  addInventoryItem: (item: any) => void;
  updateInventoryItem: (id: string, updates: any) => void;
  addInvoice: (invoice: any) => void;
  updateInvoice: (id: string, updates: any) => void;
}

// Sample data
const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed@email.com',
    phone: '+20-10-123-4567',
    address: 'New Cairo, Cairo',
    type: 'individual',
    status: 'customer',
    source: 'Website',
    assignedTo: '3',
    notes: 'Interested in luxury apartments',
    createdAt: '2024-01-15',
    lastContact: '2024-01-20',
    totalSpent: 2550000,
    properties: ['1']
  },
  {
    id: '2',
    name: 'Fatima Al Zahra',
    email: 'fatima@email.com',
    phone: '+20-11-987-6543',
    address: 'Zamalek, Cairo',
    type: 'individual',
    status: 'prospect',
    source: 'Referral',
    assignedTo: '3',
    notes: 'Looking for investment properties',
    createdAt: '2024-01-18',
    lastContact: '2024-01-22',
    totalSpent: 0,
    properties: []
  }
];

const sampleProperties: Property[] = [
  {
    id: '1',
    name: 'Cairo Heights',
    type: 'residential',
    location: 'New Cairo',
    description: 'Luxury residential tower with stunning city views',
    totalUnits: 120,
    availableUnits: 85,
    soldUnits: 25,
    reservedUnits: 10,
    basePrice: 2400000,
    status: 'construction',
    completionDate: '2024-12-31',
    images: ['https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg'],
    amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Concierge']
  },
  {
    id: '2',
    name: 'Business Central',
    type: 'commercial',
    location: 'Downtown Cairo',
    description: 'Premium office spaces in the heart of business district',
    totalUnits: 60,
    availableUnits: 45,
    soldUnits: 12,
    reservedUnits: 3,
    basePrice: 3600000,
    status: 'ready',
    images: ['https://images.pexels.com/photos/2881232/pexels-photo-2881232.jpeg'],
    amenities: ['24/7 Security', 'Parking', 'Conference Rooms', 'High-speed Internet']
  }
];

const sampleUnits: Unit[] = [
  {
    id: '1',
    propertyId: '1',
    unitNumber: 'A-1201',
    type: '2 Bedroom',
    size: 1200,
    bedrooms: 2,
    bathrooms: 2,
    price: 2550000,
    status: 'sold',
    floor: 12,
    facing: 'City View',
    customerId: '1',
    soldAt: '2024-01-15'
  },
  {
    id: '2',
    propertyId: '1',
    unitNumber: 'B-0805',
    type: '1 Bedroom',
    size: 800,
    bedrooms: 1,
    bathrooms: 1,
    price: 1950000,
    status: 'available',
    floor: 8,
    facing: 'City View'
  }
];

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Ahmed Hassan',
    payeeDetails: 'Real Estate Development LLC',
    amount: 255000,
    currency: 'EGP',
    unitId: '1',
    paymentMethod: 'cheque',
    accountant: 'Sarah Johnson',
    transactionDate: '2024-01-15',
    status: 'completed',
    comments: 'Down payment for unit A-1201',
    attachments: [],
    chequeDetails: {
      chequeNumber: 'CHQ001234',
      bankName: 'National Bank of Egypt',
      branchName: 'New Cairo',
      accountNumber: '1234567890',
      dueDate: '2024-02-15',
      status: 'cleared',
      bankProcessedDate: '2024-02-15'
    }
  },
  {
    id: '2',
    customerId: '1',
    customerName: 'Ahmed Hassan',
    payeeDetails: 'Real Estate Development LLC',
    amount: 127500,
    currency: 'EGP',
    unitId: '1',
    paymentMethod: 'cheque',
    accountant: 'Sarah Johnson',
    transactionDate: '2024-01-15',
    dueDate: '2024-03-15',
    status: 'pending',
    comments: 'First installment payment',
    attachments: [],
    chequeDetails: {
      chequeNumber: 'CHQ001235',
      bankName: 'National Bank of Egypt',
      branchName: 'New Cairo',
      accountNumber: '1234567890',
      dueDate: '2024-03-15',
      status: 'sent_to_bank'
    }
  }
];

const sampleNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    type: 'cheque_due',
    title: 'Cheque Due Tomorrow',
    message: 'Cheque CHQ001235 from Ahmed Hassan is due for processing tomorrow.',
    priority: 'high',
    read: false,
    actionRequired: true,
    actionUrl: '/accounting/cheques',
    createdAt: '2024-01-25',
    scheduledFor: '2024-01-26'
  },
  {
    id: '2',
    userId: '3',
    type: 'follow_up',
    title: 'Customer Follow-up Required',
    message: 'Follow up with Fatima Al Zahra regarding property inquiry.',
    priority: 'medium',
    read: false,
    actionRequired: true,
    actionUrl: '/crm/customers/2',
    createdAt: '2024-01-25'
  }
];

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Process pending cheques',
    description: 'Review and process all cheques due this week',
    assignedTo: '2',
    assignedBy: '1',
    dueDate: '2024-01-27',
    priority: 'high',
    status: 'pending',
    category: 'Finance',
    createdAt: '2024-01-25'
  },
  {
    id: '2',
    title: 'Prepare monthly sales report',
    description: 'Generate comprehensive sales report for January 2024',
    assignedTo: '3',
    assignedBy: '1',
    dueDate: '2024-01-31',
    priority: 'medium',
    status: 'in_progress',
    category: 'Sales',
    createdAt: '2024-01-20'
  }
];

const sampleContracts: Contract[] = [
  {
    id: '1',
    customerId: '1',
    unitId: '1',
    contractNumber: 'CNT-2024-001',
    signedDate: '2024-01-15',
    totalValue: 2550000,
    paymentTerms: '10% down payment, 90% in 24 monthly installments',
    status: 'signed',
    documents: ['contract.pdf', 'payment_schedule.pdf'],
    legalReviewed: true,
    reviewedBy: 'Legal Department'
  }
];

export const useDataStore = create<DataState>((set, get) => ({
  customers: sampleCustomers,
  properties: sampleProperties,
  units: sampleUnits,
  transactions: sampleTransactions,
  paymentPlans: [],
  contracts: sampleContracts,
  notifications: sampleNotifications,
  tasks: sampleTasks,
  employees: [],
  projects: [],
  suppliers: [],
  inventory: [],
  invoices: [],
  
  addCustomer: (customer) => set(state => ({
    customers: [...state.customers, {
      ...customer,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }]
  })),
  
  updateCustomer: (id, updates) => set(state => ({
    customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  
  updateProperty: (id, updates) => set(state => ({
    properties: state.properties.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  
  addTransaction: (transaction) => set(state => ({
    transactions: [...state.transactions, {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9)
    }]
  })),
  
  updateTransaction: (id, updates) => set(state => ({
    transactions: state.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  
  addProperty: (property) => set(state => ({
    properties: [...state.properties, {
      ...property,
      id: Math.random().toString(36).substr(2, 9)
    }]
  })),
  
  addUnit: (unit) => set(state => ({
    units: [...state.units, {
      ...unit,
      id: Math.random().toString(36).substr(2, 9)
    }]
  })),
  
  updateUnit: (id, updates) => set(state => ({
    units: state.units.map(u => u.id === id ? { ...u, ...updates } : u)
  })),
  
  markNotificationRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  
  addTask: (task) => set(state => ({
    tasks: [...state.tasks, {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }]
  })),
  
  updateTask: (id, updates) => set(state => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  addContract: (contract) => set(state => ({
    contracts: [...state.contracts, {
      ...contract,
      id: Math.random().toString(36).substr(2, 9)
    }]
  })),

  updateContract: (id, updates) => set(state => ({
    contracts: state.contracts.map(c => c.id === id ? { ...c, ...updates } : c)
  })),

  addEmployee: (employee) => set(state => ({
    employees: [...state.employees, {
      ...employee,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }]
  })),

  updateEmployee: (id, updates) => set(state => ({
    employees: state.employees.map(e => e.id === id ? { ...e, ...updates } : e)
  })),

  addProject: (project) => set(state => ({
    projects: [...state.projects, {
      ...project,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }]
  })),

  updateProject: (id, updates) => set(state => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  addSupplier: (supplier) => set(state => ({
    suppliers: [...state.suppliers, {
      ...supplier,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }]
  })),

  updateSupplier: (id, updates) => set(state => ({
    suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...updates } : s)
  })),

  addInventoryItem: (item) => set(state => ({
    inventory: [...state.inventory, {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date().toISOString()
    }]
  })),

  updateInventoryItem: (id, updates) => set(state => ({
    inventory: state.inventory.map(i => i.id === id ? { ...i, ...updates, lastUpdated: new Date().toISOString() } : i)
  })),

  addInvoice: (invoice) => set(state => ({
    invoices: [...state.invoices, {
      ...invoice,
      id: Math.random().toString(36).substr(2, 9)
    }]
  })),

  updateInvoice: (id, updates) => set(state => ({
    invoices: state.invoices.map(i => i.id === id ? { ...i, ...updates } : i)
  }))
}));