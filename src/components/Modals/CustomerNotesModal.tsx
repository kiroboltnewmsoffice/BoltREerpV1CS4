import React, { useState } from 'react';
import { X, StickyNote, Calendar, User, Tag, Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface CustomerNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
  onAddNote: (customerId: string, note: any) => void;
  onUpdateNote: (customerId: string, noteId: string, note: any) => void;
  onDeleteNote: (customerId: string, noteId: string) => void;
}

const CustomerNotesModal: React.FC<CustomerNotesModalProps> = ({ 
  isOpen, 
  onClose, 
  customer,
  onAddNote,
  onUpdateNote,
  onDeleteNote 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'normal',
    isPrivate: false,
    tags: '',
    followUpDate: ''
  });

  const noteCategories = [
    { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
    { value: 'contact', label: 'Contact Log', color: 'bg-blue-100 text-blue-800' },
    { value: 'property', label: 'Property Interest', color: 'bg-green-100 text-green-800' },
    { value: 'meeting', label: 'Meeting Notes', color: 'bg-purple-100 text-purple-800' },
    { value: 'issue', label: 'Issue/Complaint', color: 'bg-red-100 text-red-800' },
    { value: 'financial', label: 'Financial', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'personal', label: 'Personal Info', color: 'bg-pink-100 text-pink-800' },
    { value: 'follow_up', label: 'Follow-up', color: 'bg-orange-100 text-orange-800' }
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
      title: 'Initial Contact',
      content: 'Customer called inquiring about 3-bedroom properties in downtown area. Budget range $500k-$700k. Prefers modern apartments with parking. Willing to view properties this weekend.',
      category: 'contact',
      priority: 'normal',
      isPrivate: false,
      tags: ['inquiry', 'downtown', 'budget-500k-700k'],
      followUpDate: '2025-01-15',
      createdAt: '2025-01-10T10:30:00Z',
      createdBy: 'John Agent',
      updatedAt: '2025-01-10T10:30:00Z'
    },
    {
      id: '2',
      title: 'Property Viewing Feedback',
      content: 'Showed customer 3 properties today. Loved the apartment on Main Street but concerned about noise levels. Asked for similar properties in quieter neighborhoods.',
      category: 'property',
      priority: 'high',
      isPrivate: false,
      tags: ['viewing', 'feedback', 'main-street', 'noise-concern'],
      followUpDate: '2025-01-12',
      createdAt: '2025-01-11T15:45:00Z',
      createdBy: 'Sarah Agent',
      updatedAt: '2025-01-11T15:45:00Z'
    },
    {
      id: '3',
      title: 'Financial Pre-approval',
      content: 'Customer has been pre-approved for mortgage up to $650k. Bank: City Bank. Contact: Mike Johnson (555-0123). Pre-approval expires March 15, 2025.',
      category: 'financial',
      priority: 'normal',
      isPrivate: true,
      tags: ['pre-approval', 'city-bank', 'mortgage'],
      createdAt: '2025-01-08T09:15:00Z',
      createdBy: 'Financial Advisor',
      updatedAt: '2025-01-08T09:15:00Z'
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
      isPrivate: false,
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
      isPrivate: formData.isPrivate,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      followUpDate: formData.followUpDate || null,
      createdAt: editingNote?.createdAt || new Date().toISOString(),
      createdBy: editingNote?.createdBy || 'Current User',
      updatedAt: new Date().toISOString()
    };

    if (editingNote) {
      onUpdateNote(customer.id, editingNote.id, noteData);
      setNotes(prev => prev.map(note => note.id === editingNote.id ? noteData : note));
      toast.success('Note updated successfully');
    } else {
      onAddNote(customer.id, noteData);
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
      isPrivate: note.isPrivate,
      tags: Array.isArray(note.tags) ? note.tags.join(', ') : '',
      followUpDate: note.followUpDate || ''
    });
    setEditingNote(note);
    setShowAddForm(true);
  };

  const handleDelete = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDeleteNote(customer.id, noteId);
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

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (Array.isArray(note.tags) && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <StickyNote className="w-5 h-5" />
              Customer Notes
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {customer.name} • {notes.length} notes
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
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {noteCategories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>

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
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                {editingNote ? 'Edit Note' : 'Add New Note'}
              </h3>
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
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Private note (visible only to me)
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
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchTerm || filterCategory !== 'all' ? 'No notes match your search criteria' : 'No notes yet'}
              </div>
            ) : (
              filteredNotes.map(note => (
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
                      {note.isPrivate && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">Private</span>
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

export default CustomerNotesModal;
