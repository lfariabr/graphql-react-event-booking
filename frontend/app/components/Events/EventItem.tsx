import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import React from 'react';

type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'myEvents';

interface EventItemProps {
  id: string;
  title: string;
  description: string;
  date: Date;
  status: EventStatus;
  isCreator?: boolean; 
  price?: number; 
  creatorEmail?: string; 
  onViewDetails?: (id: string) => void;
  onBook?: (id: string) => void;
  isBooking?: boolean; 
}

export default function EventItem({
  id,
  title,
  description,
  date,
  status,
  isCreator = false, 
  price = 0, 
  creatorEmail = '',
  onViewDetails,
  onBook,
  isBooking = false
}: EventItemProps) {
  const statusVariant = {
    upcoming: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    ongoing: 'bg-green-100 text-green-800 hover:bg-green-100',
    completed: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
    myEvents: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  };

  // Check if this event is already booked
  const [isBooked, setIsBooked] = React.useState(false);
  
  React.useEffect(() => {
    // Check localStorage for booking data
    const checkIfBooked = () => {
      try {
        // First check in the array of bookings
        const userBookingsStr = localStorage.getItem('userBookings');
        if (userBookingsStr) {
          const userBookings = JSON.parse(userBookingsStr);
          if (userBookings && Array.isArray(userBookings) && userBookings.some(booking => 
            booking && booking.event && booking.event._id === id
          )) {
            setIsBooked(true);
            return;
          }
        }
        
        // Fallback to legacy single booking check
        const bookingData = localStorage.getItem('latestBooking');
        if (bookingData) {
          const booking = JSON.parse(bookingData);
          if (booking && booking.event && booking.event._id === id) {
            setIsBooked(true);
          }
        }
      } catch (e) {
        console.error('Error checking booking status:', e);
      }
    };
    
    // Check immediately and also when storage changes
    checkIfBooked();
    
    const handleStorageChange = () => {
      checkIfBooked();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [id]);

  // Combine local state with prop for immediate feedback
  const isEventBooked = isBooked || isBooking;

  return (
    <Card className="w-full max-w-md overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col">
            <CardTitle className="text-xl font-bold line-clamp-2">{title}</CardTitle>
            {isCreator && (
              <span className="text-xs text-emerald-600 font-medium">You created this event</span>
            )}
          </div>
          <Badge className={statusVariant[status]}>{status}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{format(date, 'PPP')}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
            >
              View Details
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-white" align="center">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray-700 mb-4">{description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{format(date, 'PPP')}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Organizer: {creatorEmail}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="font-medium">Price: ${price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button 
          size="sm"
          onClick={() => !isEventBooked && onBook?.(id)}
          disabled={status === 'completed' || status === 'cancelled' || isEventBooked}
          variant={isEventBooked ? "outline" : "default"}
          className={isEventBooked ? "border-green-500 bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-800" : ""}
        >
          {isEventBooked ? "Booked" : "Book"}
        </Button>
      </CardFooter>
    </Card>
  );
}
