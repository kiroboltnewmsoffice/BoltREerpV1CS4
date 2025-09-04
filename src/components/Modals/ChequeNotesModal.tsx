import React, { useState } from 'react';
import { X, FileText, Calendar, User, Tag, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface ChequeNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  cheque: any;
  onAddNote: (chequeId: string, note: any) => void;
  onUpdateNote: (chequeId: string, noteId: string, note: any) => void;
  onDeleteNote: (chequeId: string, noteId: string) => void;
}

const ChequeNotesModal: React.FC<ChequeNotesModalProps> = ({ 
  isOpen, 
  onClose, 
  cheque,
  onAddNote,
  onUpdateNote,
  onDeleteNote 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'normal',
    isAlert: false,
    tags: '',
    followUpDate: ''
  });

  const noteCategories = [
    { value: 'general', label: 'General Note', color: 'bg-gray-100 text-gray-800' },
    { value: 'collection', label: 'Collection Note', color: 'bg-red-100 text-red-800' },
    { value: 'verification', label: 'Verification', color: 'bg-blue-100 text-blue-800' },
    { value: 'deposit', label: 'Deposit Issue', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'bounce', label: 'Bounce/Return', color: 'bg-orange-100 text-orange-800' },
    { value: 'contact', label: 'Customer Contact', color: 'bg-green-100 text-green-800' },
    { value: 'legal', label: 'Legal Action', color: 'bg-purple-100 text-purple-800' },
    { value: 'resolution', label: 'Resolution', color: 'bg-emerald-100 text-emerald-800' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  // Sample notes data
  const [notes, setNotes] = useState([
    {
      id: '1',
      title: 'Cheque Bounced - Insufficient Funds',
      content: 'Cheque returned by bank with reason "Insufficient Funds". Contacted customer immediately. Customer promised to deposit funds by tomorrow and requested re-presentation.',
      category: 'bounce',
      priority: 'high',
      isAlert: true,
      tags: ['bounced', 'insufficient-funds', 'resubmit'],
      followUpDate: '2025-01-16',
      createdAt: '2025-01-15T09:30:00Z',
      createdBy: 'Collection Agent',
      updatedAt: '2025-01-15T09:30:00Z'
    },
    {
      id: '2',
      title: 'Customer Called to Confirm Receipt',
      content: 'Customer called to confirm they received the payment confirmation. No issues reported. Customer satisfied with the service.',
      category: 'contact',
      priority: 'normal',
      isAlert: false,
      tags: ['confirmation', 'satisfied'],
      createdAt: '2025-01-14T14:20:00Z',
      createdBy: 'Customer Service',
      updatedAt: '2025-01-14T14:20:00Z'
    },
    {
      id: '3',
      title: 'Bank Verification Required',
      content: 'Bank requires additional verification for this large amount cheque. Need to provide invoice copy and customer identification. Documents prepared and submitted.',
      category: 'verification',
      priority: 'normal',
      isAlert: false,
      tags: ['verification', 'bank-requirement', 'documents'],
      followUpDate: '2025-01-18',
      createdAt: '2025-01-13T11:15:00Z',
      createdBy: 'Accounts Team',
      updatedAt: '2025-01-13T11:15:00Z'
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'general',
      priority: 'normal',
      isAlert: false,
      tags: '',
      followUpDate: ''
    });
    setEditingNote(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    const noteData = {
      id: editingNote?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      priority: formData.priority,
      isAlert: formData.isAlert,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      followUpDate: formData.followUpDate || null,
      createdAt: editingNote?.createdAt || new Date().toISOString(),
      createdBy: editingNote?.createdBy || 'Current User',
      updatedAt: new Date().toISOString()
    };

    if (editingNote) {
      onUpdateNote(cheque.id, editingNote.id, noteData);
      setNotes(prev => prev.map(note => note.id === editingNote.id ? noteData : note));
      toast.success('Note updated successfully');
    } else {
      onAddNote(cheque.id, noteData);
      setNotes(prev => [noteData, ...prev]);
      toast.success('Note added successfully');
    }

    resetForm();
  };

  const handleEdit = (note: any) => {
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority,
      isAlert: note.isAlert,
      tags: Array.isArray(note.tags) ? note.tags.join(', ') : '',
      followUpDate: note.followUpDate || ''
    });
    setEditingNote(note);
    setShowAddForm(true);
  };

  const handleDelete = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDeleteNote(cheque.id, noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast.success('Note deleted successfully');
    }
  };

  const getCategoryColor = (category: string) => {
    return noteCategories.find(cat => cat.value === category)?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    return priorityOptions.find(p => p.value === priority)?.color || 'text-gray-600';
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!isOpen || !cheque) return null;

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
              <FileText className="w-5 h-5" />
              Cheque Notes
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Cheque #{cheque.number} • {formatCurrency(cheque.amount)} • {notes.length} notes
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
          {/* Cheque Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Cheque Number:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{cheque.number}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{formatCurrency(cheque.amount)}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <div className={`font-semibold ${cheque.status === 'cleared' ? 'text-green-600' : cheque.status === 'bounced' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {cheque.status.charAt(0).toUpperCase() + cheque.status.slice(1)}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{cheque.customerName}</div>
              </div>
            </div>
          </div>

          {/* Add Note Button */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notes & Comments</h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {noteCategories.map(category => (
                        <option key={category.value} value={category.value}>{category.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., urgent, follow-up"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      name="followUpDate"
                      value={formData.followUpDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAlert"
                    checked={formData.isAlert}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    Mark as alert (requires immediate attention)
                  </label>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingNote ? 'Update Note' : 'Add Note'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notes List */}
          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No notes yet for this cheque
              </div>
            ) : (
              notes.map(note => (
                <div key={note.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{note.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                        {noteCategories.find(cat => cat.value === note.category)?.label}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(note.priority)}`}>
                        {note.priority.toUpperCase()}
                      </span>
                      {note.isAlert && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          Alert
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-3">{note.content}</p>

                  {Array.isArray(note.tags) && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {note.createdBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDateTime(note.createdAt)}
                      </span>
                      {note.updatedAt !== note.createdAt && (
                        <span>Updated: {formatDateTime(note.updatedAt)}</span>
                      )}
                    </div>
                    {note.followUpDate && (
                      <span className="text-orange-600 dark:text-orange-400">
                        Follow-up: {note.followUpDate}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChequeNotesModal;
