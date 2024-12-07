import React, { useState } from 'react';
import { Form, useSubmit } from '@remix-run/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode }) => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = useSubmit();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch(`/auth/${mode}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `${mode} failed`);
      }

      if (mode === 'login') {
        window.location.href = '/'; // Redirect after successful login
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-bolt-elements-background-depth-1 rounded-lg p-8 w-full max-w-md border border-bolt-elements-borderColor"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-bolt-elements-textPrimary">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form method="post" onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                className="w-full p-2 rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus"
                required={mode === 'register'}
                disabled={isSubmitting}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-2 rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full p-2 rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus"
              required
              disabled={isSubmitting}
              minLength={6}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-md bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover disabled:opacity-50"
            >
              {isSubmitting 
                ? (mode === 'login' ? 'Logging in...' : 'Creating Account...') 
                : (mode === 'login' ? 'Login' : 'Create Account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 