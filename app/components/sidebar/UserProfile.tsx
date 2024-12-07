import React, { useState } from 'react';
import { useUser } from '~/lib/hooks/useUser';
import { ProfileModal } from '../profile/ProfileModal';

export const UserProfile: React.FC = () => {
  const { user } = useUser();
  const [showProfileModal, setShowProfileModal] = useState(false);

  if (!user) return null;

  return (
    <>
      <div 
        onClick={() => setShowProfileModal(true)}
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-bolt-elements-background-depth-2 transition-colors rounded-lg"
      >
        <div className="w-10 h-10 rounded-full bg-bolt-elements-button-primary-background flex items-center justify-center text-bolt-elements-button-primary-text">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-bolt-elements-textPrimary truncate">
            {user.fullName}
          </p>
          <p className="text-xs text-bolt-elements-textSecondary truncate">
            {user.email}
          </p>
        </div>
      </div>

      <ProfileModal 
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}; 