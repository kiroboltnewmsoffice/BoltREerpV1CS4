import React, { useState } from 'react';
import { X, StickyNote, Clock, User, Tag, AlertCircle, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface TransactionNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}

const TransactionNotesModal: React.FC<TransactionNotesModalProps> = ({ 
  isOpen, 
  onClose, 
  transaction 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [newNote, setNewNote] = useState('');
  const [noteCategory, setNoteCategory] = useState('general');
  const [isUrgent, setIsUrgent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Sample transaction notes data
  const [notes, setNotes] = useState([
    {
      id: '1',
      text: 'Initial payment received from customer. Property deposit for unit #405. Customer paid via bank transfer and requested receipt via email.',
      category: 'payment',
      isUrgent: false,
      tags: ['deposit', 'bank-transfer', 'receipt-requested'],
      createdBy: 'Accounts Manager',
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2025-01-10T09:00:00Z'
    },
    {
      id: '2',
      text: 'Customer called to inquire about payment processing time. Explained that bank transfers typically take 1-2 business days to reflect in our system.',
      category: 'inquiry',
      isUrgent: false,
      tags: ['customer-call', 'processing-time', 'bank-transfer'],
      createdBy: 'Customer Service',
      createdAt: '2025-01-11T14:30:00Z',
      updatedAt: '2025-01-11T14:30:00Z'
    },
    {
      id: '3',
      text: 'URGENT: Payment amount discrepancy noticed. Customer paid $10,500 but invoice was for $10,000. Need to contact customer to clarify the extra $500.',
      category: 'discrepancy',
      isUrgent: true,
      tags: ['amount-discrepancy', 'overpayment', 'requires-action'],
      createdBy: 'Finance Team',
      createdAt: '2025-01-12T11:15:00Z',
      updatedAt: '2025-01-12T11:15:00Z'
    },
    {
      id: '4',
      text: 'Contacted customer about overpayment. Customer confirmed it was intentional - they want to pay advance for next month\'s rent. Updated records accordingly.',
      category: 'resolution',
      isUrgent: false,
      tags: ['overpayment-resolved', 'advance-payment', 'next-month-rent'],
      createdBy: 'Accounts Manager',
      createdAt: '2025-01-12T16:45:00Z',
      updatedAt: '2025-01-12T16:45:00Z'
    },
    {
      id: '5',
      text: 'Applied $500 overpayment to next month\'s rent invoice. Customer will receive reduced invoice for February. Updated payment allocation in system.',
      category: 'allocation',
      isUrgent: false,
      tags: ['payment-allocation', 'future-credit', 'invoice-adjustment'],
      createdBy: 'Finance Team',
      createdAt: '2025-01-13T10:20:00Z',
      updatedAt: '2025-01-13T10:20:00Z'
    }
  ]);

  const noteCategories = [
    { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
    { value: 'payment', label: 'Payment', color: 'bg-green-100 text-green-800' },
    { value: 'inquiry', label: 'Customer Inquiry', color: 'bg-blue-100 text-blue-800' },
    { value: 'discrepancy', label: 'Discrepancy', color: 'bg-red-100 text-red-800' },
    { value: 'resolution', label: 'Resolution', color: 'bg-purple-100 text-purple-800' },
    { value: 'allocation', label: 'Allocation', color: 'bg-orange-100 text-orange-800' },
    { value: 'follow-up', label: 'Follow-up', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'compliance', label: 'Compliance', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const allTags = [
    'deposit', 'bank-transfer', 'receipt-requested', 'customer-call', 'processing-time',
    'amount-discrepancy', 'overpayment', 'requires-action', 'overpayment-resolved',
    'advance-payment', 'next-month-rent', 'payment-allocation', 'future-credit',
    'invoice-adjustment', 'refund', 'chargeback', 'tax-related', 'audit-trail'
  ];

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note = {
      id: Date.now().toString(),
      text: newNote,
      category: noteCategory,
      isUrgent,
      tags: [],
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes([note, ...notes]);
    setNewNote('');
    setNoteCategory('general');
    setIsUrgent(false);
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setEditText(note.text);
    }
  };

  const handleSaveEdit = () => {
    if (!editText.trim() || !editingNote) return;

    setNotes(notes.map(note => 
      note.id === editingNote 
        ? { ...note, text: editText, updatedAt: new Date().toISOString() }
        : note
    ));
    setEditingNote(null);
    setEditText('');
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryObj = noteCategories.find(c => c.value === category);
    return categoryObj?.color || 'bg-gray-100 text-gray-800';
  };

  const filterNotes = () => {
    return notes.filter(note => {
      const matchesSearch = note.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const filteredNotes = filterNotes();

  if (!isOpen || !transaction) return null;

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
              <StickyNote className="w-5 h-5" />
              Transaction Notes
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Transaction #{transaction.id} • {transaction.amount} • {filteredNotes.length} notes
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
          {/* Transaction Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{transaction.id}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{transaction.amount}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{transaction.type}</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                <div className="font-semibold text-gray-900 dark:text-white">{transaction.customerName}</div>
              </div>
            </div>
          </div>

          {/* Add New Note */}
          <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Note
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {noteCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      Mark as Urgent
                    </span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Note Content
                </label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note about this transaction..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchTerm || selectedTag !== 'all' ? 'No notes match your search criteria' : 'No notes yet. Add the first note above.'}
              </div>
            ) : (
              filteredNotes.map(note => (
                <div key={note.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                        {noteCategories.find(c => c.value === note.category)?.label}
                      </span>
                      {note.isUrgent && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Urgent
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditNote(note.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {editingNote === note.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNote(null)}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white mb-3">{note.text}</p>
                  )}
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {note.createdBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(note.createdAt)}
                      {note.updatedAt !== note.createdAt && (
                        <span className="text-orange-500"> (edited)</span>
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{notes.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {notes.filter(n => n.isUrgent).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Urgent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {notes.filter(n => n.category === 'payment').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Payment Related</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {notes.filter(n => n.category === 'resolution').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Resolutions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionNotesModal;
