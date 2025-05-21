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
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [bookedEventIds, setBookedEventIds] = useState<string[]>([]);
  const { token, userId } = useAuth();
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

        const transformedEvents = responseData.data.events.map((event: any) => ({
          ...event,
          status: 'upcoming', 
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
        ? event.creator._id === userId 
        : event.status === activeTab);
    
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesTab && matchesSearch;
  });

  const handleViewDetails = (id: string) => {
    router.push(`/events/${id}`);
  };

  const handleBook = async (id: string) => {
    try {
      if (!token || !userId) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to book an event',
          variant: 'destructive',
        })
        return;
      }
      
      setBookedEventIds(prev => [...prev, id]);
      
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation BookEvent($eventId: ID!, $userId: ID!) {
              bookEvent(eventId: $eventId, userId: $userId) {
                _id
                event {
                  _id
                  title
                }
                user {
                  _id
                  email
                }
                createdAt
              }
            }
          `,
          variables: {
            eventId: id,
            userId: userId
          }
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.errors?.[0]?.message || 'Failed to book event');
      }
      if (responseData.errors) {
        throw new Error(responseData.errors[0].message);
      }
      
      if (responseData.data && responseData.data.bookEvent) {
        let storedBookings = [];
        try {
          const existingData = localStorage.getItem('userBookings');
          if (existingData) {
            storedBookings = JSON.parse(existingData);
          }
        } catch (e) {
          console.error('Error parsing stored bookings:', e);
        }
        
        const newBooking = responseData.data.bookEvent;
        const bookingExists = storedBookings.some((b: any) => b._id === newBooking._id);
        
        if (!bookingExists) {
          storedBookings.push(newBooking);
          localStorage.setItem('userBookings', JSON.stringify(storedBookings));
        }
        
        localStorage.setItem('latestBooking', JSON.stringify(responseData.data.bookEvent));
        localStorage.setItem('bookingConfirmed', new Date().toISOString());
      }
      
      toast({
        title: 'Booking Successful',
        description: `You've successfully booked "${responseData.data.bookEvent.event.title}"`,
      });
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to book the event';
      toast({
        title: 'Booking Failed',
        description: errorMessage,
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
              status={event.status || 'upcoming'}
              isCreator={event.creator._id === userId}
              price={event.price}
              creatorEmail={event.creator.email}
              onViewDetails={handleViewDetails}
              onBook={handleBook}
              isBooking={bookedEventIds.includes(event._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}