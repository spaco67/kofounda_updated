import { useEffect, useState } from 'react';

interface User {
  _id: string;
  fullName: string;
  email: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return { user, logout };
} 