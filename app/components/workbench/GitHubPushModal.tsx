import React from 'react';

interface GitHubPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (repoName: string, username: string, token: string) => void;
}

export const GitHubPushModal: React.FC<GitHubPushModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [repoName, setRepoName] = React.useState('bolt-generated-project');
  const [username, setUsername] = React.useState('');
  const [token, setToken] = React.useState('');

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-6 w-full max-w-md border border-bolt-elements-borderColor">
        <h2 className="text-xl font-bold mb-4 text-bolt-elements-textPrimary">Push to GitHub</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">Repository Name</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full p-2 rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus"
              placeholder="Kofounda generated repo name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">GitHub Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus"
              placeholder="e.g., johndoe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-bolt-elements-textSecondary mb-1">
              Personal Access Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-2 rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus"
              placeholder="ghp_xxxxxxxxxxxx"
            />
            <p className="mt-1 text-xs text-bolt-elements-textTertiary">
              Need a token?{' '}
              <a
                href="https://github.com/settings/tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bolt-elements-link hover:underline"
              >
                Create one here
              </a>{' '}
              with 'repo' scope.
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-2"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!repoName || !username || !token) {
                  alert('Please fill in all fields');
                  return;
                }

                onSubmit(repoName, username, token);
                onClose();
              }}
              className="px-4 py-2 rounded-md bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover"
            >
              Push to GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
