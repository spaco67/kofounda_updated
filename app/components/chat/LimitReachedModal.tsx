import React from 'react';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
}

export const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ isOpen, onClose, onRegister }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-bolt-elements-background-depth-1 rounded-lg p-8 w-full max-w-md border border-bolt-elements-borderColor text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-bolt-elements-textPrimary">
          Prompt Limit Reached
        </h2>
        <p className="text-bolt-elements-textSecondary mb-6">
          You've reached the limit of 10 prompts for unregistered users. Register now to get unlimited access!
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2"
          >
            Maybe Later
          </button>
          <button
            onClick={onRegister}
            className="px-6 py-2 rounded-md bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}; 