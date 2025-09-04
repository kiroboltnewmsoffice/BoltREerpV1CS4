export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  permissions: Permission[];
}

export type UserRole = 
  | 'super_admin'
  | 'finance_manager' 
  | 'sales_manager'
  | 'accountant'
  | 'sales_representative'
  | 'customer_service'
  | 'viewer';

export interface Permission {
  module: string;
  actions: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'individual' | 'corporate';
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  source: string;
  assignedTo: string;
  notes: string;
  createdAt: string;
  lastContact?: string;
  totalSpent: number;
  properties: string[];
}

export interface Property {
  id: string;
  name: string;
  type: 'residential' | 'commercial';
  location: string;
  description: string;
  totalUnits: number;
  availableUnits: number;
  soldUnits: number;
  reservedUnits: number;
  basePrice: number;
  status: 'planning' | 'construction' | 'ready' | 'completed';
  completionDate?: string;
  images: string[];
  amenities: string[];
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  type: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  discountedPrice?: number;
  status: 'available' | 'reserved' | 'sold' | 'maintenance';
  floor: number;
  facing: string;
  customerId?: string;
  reservedAt?: string;
  soldAt?: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  payeeDetails: string;
  amount: number;
  currency: string;
  unitId?: string;
  paymentMethod: 'cash' | 'instapay' | 'cheque' | 'bank_transfer' | 'other';
  accountant: string;
  transactionDate: string;
  dueDate?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  comments?: string;
  attachments: string[];
  chequeDetails?: ChequeDetails;
}

export interface ChequeDetails {
  chequeNumber: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  dueDate: string;
  status: 'pending' | 'sent_to_bank' | 'cleared' | 'bounced' | 'cancelled';
  bankProcessedDate?: string;
  bounceReason?: string;
  followUpNotes?: string;
}

export interface PaymentPlan {
  id: string;
  customerId: string;
  unitId: string;
  totalAmount: number;
  downPayment: number;
  installments: Installment[];
  status: 'active' | 'completed' | 'defaulted' | 'cancelled';
  createdAt: string;
}

export interface Installment {
  id: string;
  planId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paidAmount?: number;
  paidDate?: string;
  transactionId?: string;
}

export interface Contract {
  id: string;
  customerId: string;
  unitId: string;
  contractNumber: string;
  signedDate: string;
  totalValue: number;
  paymentTerms: string;
  status: 'draft' | 'pending_signature' | 'signed' | 'executed' | 'terminated';
  documents: string[];
  legalReviewed: boolean;
  reviewedBy?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'payment_reminder' | 'cheque_due' | 'follow_up' | 'task' | 'system';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
  scheduledFor?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'revenue' | 'sales' | 'customer' | 'property' | 'financial';
  filters: Record<string, any>;
  data: any;
  generatedBy: string;
  generatedAt: string;
}