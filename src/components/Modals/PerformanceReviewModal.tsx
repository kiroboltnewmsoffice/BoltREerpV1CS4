import React, { useState } from 'react';
import { X, Award, Star, TrendingUp, Target, FileText, Calendar } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import toast from 'react-hot-toast';

interface PerformanceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  onSaveReview: (employeeId: string, review: any) => void;
}

const PerformanceReviewModal: React.FC<PerformanceReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  employee,
  onSaveReview 
}) => {
  useEscapeKey(isOpen, onClose);
  
  const [formData, setFormData] = useState({
    reviewPeriod: '',
    overallRating: 3,
    goals: '',
    achievements: '',
    areasForImprovement: '',
    feedback: '',
    nextReviewDate: '',
    reviewerComments: ''
  });

  const ratingLabels = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, overallRating: rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reviewPeriod) {
      toast.error('Please select a review period');
      return;
    }

    const review = {
      id: Date.now().toString(),
      employeeId: employee.id,
      reviewPeriod: formData.reviewPeriod,
      overallRating: formData.overallRating,
      goals: formData.goals,
      achievements: formData.achievements,
      areasForImprovement: formData.areasForImprovement,
      feedback: formData.feedback,
      nextReviewDate: formData.nextReviewDate,
      reviewerComments: formData.reviewerComments,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    onSaveReview(employee.id, review);
    toast.success('Performance review saved successfully');
    onClose();
  };

  if (!isOpen || !employee) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Review</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{employee.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {employee.role} • {employee.department}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Review Period
              </label>
              <select
                name="reviewPeriod"
                value={formData.reviewPeriod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select review period</option>
                <option value="Q1 2025">Q1 2025</option>
                <option value="Q2 2025">Q2 2025</option>
                <option value="Q3 2025">Q3 2025</option>
                <option value="Q4 2025">Q4 2025</option>
                <option value="Annual 2025">Annual 2025</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Next Review Date
              </label>
              <input
                type="date"
                name="nextReviewDate"
                value={formData.nextReviewDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Star className="w-4 h-4 inline mr-1" />
              Overall Performance Rating
            </label>
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    formData.overallRating >= rating
                      ? 'bg-yellow-400 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {ratingLabels[formData.overallRating - 1]}
              </span>
            </div>
          </div>

          <div className="space-y-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Goals for Review Period
              </label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List the key goals and objectives for this review period..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Award className="w-4 h-4 inline mr-1" />
                Key Achievements
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe notable achievements and successes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Areas for Improvement
              </label>
              <textarea
                name="areasForImprovement"
                value={formData.areasForImprovement}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Identify areas where improvement is needed..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Employee Feedback
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Employee's self-assessment and feedback..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reviewer Comments
              </label>
              <textarea
                name="reviewerComments"
                value={formData.reviewerComments}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional comments from the reviewer..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Complete Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PerformanceReviewModal;
