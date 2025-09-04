import { useEffect } from 'react';

/**
 * Custom hook to handle ESC key press for closing modals
 * @param isOpen - Whether the modal is currently open
 * @param onClose - Function to call when ESC is pressed
 */
export const useEscapeKey = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      // Use capture phase for better event handling
      document.addEventListener('keydown', handleEscapeKey, true);
      window.addEventListener('keydown', handleEscapeKey, true);
      
      // Ensure the modal container can receive focus for keyboard events
      const focusableElement = document.querySelector('[role="dialog"]') || document.body;
      if (focusableElement instanceof HTMLElement) {
        focusableElement.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey, true);
      window.removeEventListener('keydown', handleEscapeKey, true);
    };
  }, [isOpen, onClose]);
};
