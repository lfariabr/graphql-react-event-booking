'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth-context';
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from '@/app/components/ui/use-toast';
import BookingItem from './BookingItem';

interface Booking {
  _id: string;
  event: {
    _id: string;
    title: string;
    description?: string;
    date: string;
    price: number;
  };
  user: {
    _id: string;
    email: string;
  };
  createdAt: string;
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { token, userId } = useAuth();

  useEffect(() => {
    const fetchRealBookings = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const eventsResponse = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query {
                events {
                  _id
                  title
                  description
                  date
                  price
                }
              }
            `
          }),
        });
        
        const eventsData = await eventsResponse.json();
        
        if (eventsData.errors) {
          throw new Error('Failed to load events data');
        }
        
        const eventsMap: any = {};
        eventsData.data.events.forEach((event: any) => {
          eventsMap[event._id] = event;
        });
        
        const realBookings = [];
        
        try {
          const storedBookingsStr = localStorage.getItem('userBookings');
          if (storedBookingsStr) {
            const storedBookings = JSON.parse(storedBookingsStr);
            
            storedBookings.forEach((booking: any) => {
              if (booking && booking._id && booking.event && eventsMap[booking.event._id]) {
                const eventDetails = eventsMap[booking.event._id];
                
                realBookings.push({
                  _id: booking._id,
                  event: {
                    _id: booking.event._id,
                    title: booking.event.title || eventDetails.title,
                    description: eventDetails.description || '',
                    date: eventDetails.date,
                    price: eventDetails.price || 0
                  },
                  user: booking.user || {
                    _id: userId,
                    email: 'you@example.com'
                  },
                  createdAt: booking.createdAt
                });
              }
            });
          } else {
            const latestBookingStr = localStorage.getItem('latestBooking');
            if (latestBookingStr) {
              const latestBooking = JSON.parse(latestBookingStr);
              if (latestBooking && latestBooking._id && latestBooking.event && eventsMap[latestBooking.event._id]) {
                const eventDetails = eventsMap[latestBooking.event._id];
                
                realBookings.push({
                  _id: latestBooking._id,
                  event: {
                    _id: latestBooking.event._id,
                    title: latestBooking.event.title || eventDetails.title,
                    description: eventDetails.description || '',
                    date: eventDetails.date,
                    price: eventDetails.price || 0
                  },
                  user: latestBooking.user || {
                    _id: userId,
                    email: 'you@example.com'
                  },
                  createdAt: latestBooking.createdAt
                });
              }
            }
          }
        } catch (e) {
          console.error('Error parsing bookings from localStorage:', e);
        }
        
        setBookings(realBookings);
        
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError('Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchRealBookings();
  }, [token, userId]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bookingConfirmed') {
        window.location.reload();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setBookings(prev => prev.filter(b => b._id !== bookingId));
      
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation CancelBooking($bookingId: ID!) {
              cancelBooking(bookingId: $bookingId) {
                _id
                title
              }
            }
          `,
          variables: {
            bookingId
          }
        }),
      });

      const responseData = await response.json();
      
      if (responseData.errors) {
        throw new Error(responseData.errors[0].message);
      }
      
      try {
        const storedBookingsStr = localStorage.getItem('userBookings');
        if (storedBookingsStr) {
          let storedBookings = JSON.parse(storedBookingsStr);
          storedBookings = storedBookings.filter((b: any) => b._id !== bookingId);
          localStorage.setItem('userBookings', JSON.stringify(storedBookings));
        }
        
        const latestBookingStr = localStorage.getItem('latestBooking');
        if (latestBookingStr) {
          const latestBooking = JSON.parse(latestBookingStr);
          if (latestBooking && latestBooking._id === bookingId) {
            localStorage.removeItem('latestBooking');
          }
        }
      } catch (e) {
        console.error('Error updating localStorage after cancellation:', e);
      }
      
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been successfully cancelled',
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      
      window.location.reload();
      
      toast({
        title: 'Cancellation Failed',
        description: error instanceof Error ? error.message : 'Unable to cancel booking',
        variant: 'destructive',
      });
    }
  };

  const filteredBookings = bookings.filter(booking => 
    booking.event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery 
              ? 'No bookings match your search.' 
              : 'You have no bookings yet.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((booking) => (
            <BookingItem
              key={booking._id}
              id={booking._id}
              event={booking.event}
              createdAt={booking.createdAt}
              onCancel={handleCancelBooking}
            />
          ))}
        </div>
      )}
    </div>
  );
}