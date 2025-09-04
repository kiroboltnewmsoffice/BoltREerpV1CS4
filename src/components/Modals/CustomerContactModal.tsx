import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Building, Calendar, Edit } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface CustomerContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
  onUpdateContact: (customerId: string, contactData: any) => void;
}

const CustomerContactModal: React.FC<CustomerContactModalProps> = ({ 
  isOpen, 
  onClose, 
  customer,
  onUpdateContact 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    alternatePhone: customer?.alternatePhone || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    zipCode: customer?.zipCode || '',
    country: customer?.country || '',
    company: customer?.company || '',
    position: customer?.position || '',
    website: customer?.website || '',
    preferredContact: customer?.preferredContact || 'email',
    timezone: customer?.timezone || '',
    notes: customer?.notes || ''
  });

  const preferredContactOptions = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'both', label: 'Both Email & Phone', icon: User }
  ];

  const timezones = [
    'UTC-12:00 - Baker Island',
    'UTC-11:00 - American Samoa',
    'UTC-10:00 - Hawaii',
    'UTC-09:00 - Alaska',
    'UTC-08:00 - Pacific Time',
    'UTC-07:00 - Mountain Time',
    'UTC-06:00 - Central Time',
    'UTC-05:00 - Eastern Time',
    'UTC-04:00 - Atlantic Time',
    'UTC-03:00 - Argentina',
    'UTC-02:00 - South Georgia',
    'UTC-01:00 - Azores',
    'UTC+00:00 - London/Dublin',
    'UTC+01:00 - Central European',
    'UTC+02:00 - Eastern European',
    'UTC+03:00 - Moscow',
    'UTC+04:00 - Gulf Standard',
    'UTC+05:00 - Pakistan',
    'UTC+05:30 - India',
    'UTC+06:00 - Bangladesh',
    'UTC+07:00 - Vietnam',
    'UTC+08:00 - China/Singapore',
    'UTC+09:00 - Japan/Korea',
    'UTC+10:00 - Eastern Australia',
    'UTC+11:00 - Solomon Islands',
    'UTC+12:00 - New Zealand'
  ];

  // Sample contact history
  const contactHistory = [
    {
      id: '1',
      type: 'email',
      description: 'Sent property inquiry response',
      timestamp: '2025-01-15T10:30:00Z',
      agent: 'John Agent',
      success: true
    },
    {
      id: '2',
      type: 'phone',
      description: 'Called to schedule property viewing',
      timestamp: '2025-01-14T14:45:00Z',
      agent: 'Sarah Agent',
      success: true
    },
    {
      id: '3',
      type: 'email',
      description: 'Email bounced - invalid address',
      timestamp: '2025-01-12T09:15:00Z',
      agent: 'System',
      success: false
    },
    {
      id: '4',
      type: 'phone',
      description: 'No answer - left voicemail',
      timestamp: '2025-01-10T16:20:00Z',
      agent: 'Mike Agent',
      success: false
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const contactData = {
      ...formData,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Current User'
    };

    onUpdateContact(customer.id, contactData);
    toast.success('Customer contact information updated successfully');
    setIsEditing(false);
  };

  const formatPhoneNumber = (phone: string) => {
    // Basic phone formatting for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'phone': return Phone;
      default: return User;
    }
  };

  const getContactStatusColor = (success: boolean) => {
    return success ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  if (!isOpen || !customer) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Contact Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {customer.name} • Customer ID: {customer.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Details</h3>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Primary Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alternate Phone
                    </label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Contact Method
                      </label>
                      <select
                        name="preferredContact"
                        value={formData.preferredContact}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {preferredContactOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select timezone</option>
                        {timezones.map(tz => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional notes about this customer"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{customer.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Full Name</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{customer.email}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Email Address</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{formatPhoneNumber(customer.phone)}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Primary Phone</div>
                      </div>
                    </div>

                    {customer.alternatePhone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{formatPhoneNumber(customer.alternatePhone)}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Alternate Phone</div>
                        </div>
                      </div>
                    )}

                    {customer.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {customer.address}
                            {customer.city && `, ${customer.city}`}
                            {customer.state && `, ${customer.state}`}
                            {customer.zipCode && ` ${customer.zipCode}`}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Address</div>
                        </div>
                      </div>
                    )}

                    {customer.company && (
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {customer.company}
                            {customer.position && ` - ${customer.position}`}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Company & Position</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {customer.preferredContact && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Preferred Contact: {preferredContactOptions.find(opt => opt.value === customer.preferredContact)?.label}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Contact History */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Contact History</h3>
              
              <div className="space-y-3">
                {contactHistory.map(contact => {
                  const IconComponent = getContactTypeIcon(contact.type);
                  return (
                    <div key={contact.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className={`p-2 rounded-lg ${getContactStatusColor(contact.success)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{contact.description}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          by {contact.agent} • {formatDateTime(contact.timestamp)}
                        </div>
                        <div className={`text-xs font-medium mt-1 ${contact.success ? 'text-green-600' : 'text-red-600'}`}>
                          {contact.success ? 'Successful' : 'Failed'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerContactModal;
