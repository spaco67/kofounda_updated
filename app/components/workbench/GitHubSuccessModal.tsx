import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface GitHubSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  repoName: string;
  username: string;
}

export const GitHubSuccessModal: React.FC<GitHubSuccessModalProps> = ({ isOpen, onClose, repoName, username }) => {
  const [confettiInstance, setConfettiInstance] = useState<confetti.CreateTypes | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Start the confetti animation
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const instance = confetti.create(undefined, { 
        resize: true,
        useWorker: true 
      });
      setConfettiInstance(instance);

      const runAnimation = () => {
        const timeLeft = animationEnd - Date.now();

        const particleCount = 50 * (timeLeft / duration);
        
        instance({
          particleCount,
          spread: 80,
          origin: { y: 0.6 },
          angle: randomInRange(55, 125),
          colors: ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#4169E1']
        });

        if (timeLeft > 0) {
          requestAnimationFrame(runAnimation);
        }
      };

      runAnimation();
    }

    return () => {
      if (confettiInstance) {
        confettiInstance.reset();
        setConfettiInstance(null);
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    if (confettiInstance) {
      confettiInstance.reset();
      setConfettiInstance(null);
    }
    onClose();
  };

  if (!isOpen) return null;

  const repoUrl = `https://github.com/${username}/${repoName}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose} // Close when clicking outside
    >
      <div 
        className="bg-bolt-elements-background-depth-1 rounded-lg p-8 w-full max-w-md border border-bolt-elements-borderColor text-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-4 text-bolt-elements-textPrimary">
          Congratulations!
        </h2>
        <p className="text-bolt-elements-textSecondary mb-4">
          Your code has been successfully pushed to{' '}
          <span className="font-bold text-bolt-elements-textPrimary">
            {repoName}
          </span>
        </p>
        <a 
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-6 text-bolt-elements-link hover:underline"
        >
          View your repository →
        </a>
        <button
          onClick={handleClose}
          className="px-6 py-2 rounded-md bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover"
        >
          OK
        </button>
      </div>
    </div>
  );
}; 