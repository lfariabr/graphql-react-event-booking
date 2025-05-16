'use client';

import { useAuth } from '../../context/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EventsView() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div>
      <h1>Events</h1>
      <p>Welcome to the events page!</p>
    </div>
  );
}