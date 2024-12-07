import React, { useState } from 'react';
import { useUser } from '~/lib/hooks/useUser';

interface PlanProps {
  name: string;
  price: number;
  features: string[];
  onSelect: () => void;
  isPopular?: boolean;
  disabled?: boolean;
}

const Plan: React.FC<PlanProps> = ({ name, price, features, onSelect, isPopular, disabled }) => (
  <div className={`relative p-6 bg-bolt-elements-background-depth-1 rounded-lg border ${
    isPopular ? 'border-bolt-elements-button-primary-background' : 'border-bolt-elements-borderColor'
  }`}>
    {isPopular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="px-3 py-1 text-xs font-semibold text-bolt-elements-button-primary-text bg-bolt-elements-button-primary-background rounded-full">
          Most Popular
        </span>
      </div>
    )}
    <h3 className="text-xl font-bold text-bolt-elements-textPrimary mb-2">{name}</h3>
    <div className="mb-4">
      <span className="text-3xl font-bold text-bolt-elements-textPrimary">₦{price.toLocaleString()}</span>
      <span className="text-bolt-elements-textSecondary">/month</span>
    </div>
    <ul className="space-y-3 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-bolt-elements-textSecondary">
          <span className="mr-2 text-green-500">✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`w-full py-2 px-4 rounded-md ${
        isPopular
          ? 'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text'
          : 'bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary'
      } hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {disabled ? 'Processing...' : 'Select Plan'}
    </button>
  </div>
);

export const SubscriptionPlans: React.FC = () => {
  const { user } = useUser();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async (tier: string, price: number) => {
    try {
      setError('');
      setLoading(true);

      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier, price }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create subscription');
      }
      
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Plan
          name="Basic"
          price={10000}
          features={[
            'AI Website Builder',
            'Basic Templates',
            'Community Support',
            '5 Projects/month'
          ]}
          onSelect={() => handleSelectPlan('BASIC', 10000)}
          disabled={loading}
        />
        <Plan
          name="Standard"
          price={30000}
          features={[
            'Everything in Basic',
            'Premium Templates',
            'Priority Support',
            '15 Projects/month',
            'Custom Domain'
          ]}
          onSelect={() => handleSelectPlan('STANDARD', 30000)}
          isPopular
          disabled={loading}
        />
        <Plan
          name="Premium"
          price={50000}
          features={[
            'Everything in Standard',
            'Custom Templates',
            'Dedicated Support',
            'Unlimited Projects',
            'Advanced Analytics',
            'Team Collaboration'
          ]}
          onSelect={() => handleSelectPlan('PREMIUM', 50000)}
          disabled={loading}
        />
      </div>
    </div>
  );
}; 