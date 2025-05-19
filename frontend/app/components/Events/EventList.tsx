'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import EventItem from './EventItem';
import { toast } from '@/app/components/ui/use-toast';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  price: number;
  creator: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  // These fields are in your mock data but not in the schema
  // You might want to add them to your schema
  location?: string;
  capacity?: number;
  attendees?: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  imageUrl?: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query GetEvents {
                events {
                  _id
                  title
                  description
                  price
                  date
                  creator {
                    _id
                    email
                  }
                  createdAt
                  updatedAt
                }
              }
            `,
          }),
        });

        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.errors?.[0]?.message || 'Failed to fetch events');
        }

        if (responseData.errors) {
          throw new Error(responseData.errors[0].message);
        }

        // Transform the data to match EventItem props
        const transformedEvents = responseData.data.events.map((event: any) => ({
          ...event,
          // Add default values for fields not in the schema
          location: 'Location not specified', // Default value
          capacity: 100, // Default value
          attendees: 0, // Default value
          status: 'upcoming', // Default value
          imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f96d5518?w=800&auto=format&fit=crop&q=60' // Default image
        }));

        setEvents(transformedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const filteredEvents = events.filter(event => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'myEvents' 
        ? event.creator._id === useAuth().userId 
        : event.status === activeTab);
    
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesTab && matchesSearch;
  });

  const handleViewDetails = (id: string) => {
    router.push(`/events/${id}`);
  };

  const handleRegister = async (id: string) => {
    try {
      // TODO: Implement registration logic
      console.log('Register for event:', id);
      toast({
        title: 'Registration',
        description: 'Successfully registered for the event!',
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: 'Error',
        description: 'Failed to register for the event',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">Error: {error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 sm:grid-cols-4 gap-1">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery 
              ? 'No events match your search.' 
              : `No ${activeTab === 'all' ? '' : activeTab + ' '}events found.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventItem
              key={event._id}
              id={event._id}
              title={event.title}
              description={event.description}
              date={new Date(event.date)}
              duration={120} // You might want to add this to your API
              location={event.location}
              capacity={event.capacity}
              attendees={event.attendees}
              status={event.status}
              imageUrl={event.imageUrl}
              onViewDetails={handleViewDetails}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}
    </div>
  );
}