'use client';

import { useAuth } from '../../context/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/app/components/ui/button";
import { Plus } from 'lucide-react';
import EventList from '@/app/components/Events/EventList';

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
    <div className="container py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Browse and manage your events</p>
        </div>
        <Button asChild>
          <Link href="/events/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>
      
      <EventList 
        
      />
    </div>
  );
}