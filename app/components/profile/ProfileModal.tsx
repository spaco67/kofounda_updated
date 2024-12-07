import React, { useState, useEffect } from 'react';
import { useUser } from '~/lib/hooks/useUser';
import { SubscriptionPlans } from '../subscription/SubscriptionPlans';
import { createPortal } from 'react-dom';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useUser();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
      >
        <div 
          className="bg-bolt-elements-background-depth-1 rounded-lg p-8 w-full max-w-md border border-bolt-elements-borderColor"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-bolt-elements-button-primary-background flex items-center justify-center text-bolt-elements-button-primary-text text-2xl">
              {user?.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-bolt-elements-textPrimary">
                {user?.fullName}
              </h2>
              <p className="text-sm text-bolt-elements-textSecondary">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="w-full px-4 py-2 rounded-lg bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover"
            >
              Manage Subscription
            </button>

            <button
              onClick={logout}
              className="w-full px-4 py-2 rounded-lg border border-bolt-elements-borderColor text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {showSubscriptionModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black bg-opacity-50">
          <div 
            className="bg-bolt-elements-background-depth-1 rounded-lg p-8 w-full max-w-6xl border border-bolt-elements-borderColor max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-bolt-elements-textPrimary">
                Subscription Plans
              </h2>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary"
              >
                ✕
              </button>
            </div>
            <SubscriptionPlans />
          </div>
        </div>
      )}
    </>
  );

  return createPortal(modalContent, document.body);
}; 