// Extended ERP Modules

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'terminated';
  manager?: string;
  skills: string[];
  performance: number;
  avatar?: string;
  emergencyContact?: EmergencyContact;
  benefits: string[];
  leaveBalance: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'active' | 'inactive';
  rating: number;
  totalOrders: number;
  totalSpent: number;
  paymentTerms: string;
  contactPerson: string;
  taxId?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  approvedBy?: string;
}

export interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: string;
}

export interface Inventory {
  id: string;
  itemName: string;
  category: string;
  sku: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  propertyId?: string;
  manager: string;
  team: string[];
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  progress: number;
  milestones: ProjectMilestone[];
  risks: ProjectRisk[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  completedDate?: string;
}

export interface ProjectRisk {
  id: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  probability: 'low' | 'medium' | 'high';
  mitigation: string;
  status: 'open' | 'mitigated' | 'closed';
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'print' | 'digital';
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  leads: number;
  conversions: number;
  roi: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  score: number;
  assignedTo: string;
  interestedIn: string[];
  budget: number;
  timeline: string;
  notes: string;
  createdAt: string;
  lastContact?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  relatedEntity?: string;
  relatedEntityType?: string;
  tags: string[];
  isPublic: boolean;
  url: string;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: string;
  receipt?: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submittedBy: string;
  projectId?: string;
  supplierId?: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  serialNumber?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciation: number;
  location: string;
  assignedTo?: string;
  status: 'active' | 'maintenance' | 'retired' | 'disposed';
  warrantyExpiry?: string;
  maintenanceSchedule?: string;
}

export interface Maintenance {
  id: string;
  assetId?: string;
  propertyId?: string;
  title: string;
  description: string;
  type: 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  assignedTo: string;
  cost: number;
  notes?: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  breakTime: number;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'emergency' | 'maternity' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  submittedAt: string;
  respondedAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Budget {
  id: string;
  name: string;
  department: string;
  period: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  categories: BudgetCategory[];
  status: 'active' | 'completed' | 'exceeded';
  approvedBy: string;
  createdAt: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
}

export interface Audit {
  id: string;
  action: string;
  module: string;
  entityId: string;
  entityType: string;
  userId: string;
  userName: string;
  timestamp: string;
  details: Record<string, any>;
  ipAddress: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  module: string;
  steps: WorkflowStep[];
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  assignedRole: string;
  action: string;
  order: number;
  isRequired: boolean;
}

export interface Communication {
  id: string;
  type: 'email' | 'sms' | 'call' | 'meeting';
  subject: string;
  content: string;
  fromUserId: string;
  toCustomerId?: string;
  toEmployeeId?: string;
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'replied';
  scheduledAt?: string;
  sentAt?: string;
  attachments: string[];
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  customerId?: string;
  employeeId: string;
  propertyId?: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'viewing' | 'meeting' | 'consultation' | 'inspection';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  reminders: string[];
}

export interface Commission {
  id: string;
  employeeId: string;
  transactionId: string;
  customerId: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'approved' | 'paid';
  calculatedAt: string;
  paidAt?: string;
  notes?: string;
}

export interface Target {
  id: string;
  employeeId: string;
  type: 'sales' | 'revenue' | 'leads' | 'calls';
  target: number;
  achieved: number;
  period: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'missed';
  bonus?: number;
}