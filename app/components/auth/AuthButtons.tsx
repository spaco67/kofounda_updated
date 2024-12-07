import React, { useState } from 'react';
import { AuthModal } from './AuthModal';
import { useUser } from '~/lib/hooks/useUser';

export const AuthButtons: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { user, logout } = useUser();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-bolt-elements-textPrimary">
          Welcome, {user.fullName}
        </span>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-transparent border border-bolt-elements-borderColor text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setShowLoginModal(true)}
        className="px-4 py-2 rounded-lg bg-transparent border border-bolt-elements-borderColor text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2"
      >
        Login
      </button>
      <button
        onClick={() => setShowRegisterModal(true)}
        className="px-4 py-2 rounded-lg bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover"
      >
        Register
      </button>

      <AuthModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        mode="login"
      />
      <AuthModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        mode="register"
      />
    </div>
  );
}; 