
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { format } from 'date-fns';

type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'myEvents';

interface EventItemProps {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number; // in minutes
  location: string;
  capacity: number;
  attendees: number;
  status: EventStatus;
  imageUrl?: string;
  onViewDetails?: (id: string) => void;
  onRegister?: (id: string) => void;
}

export default function EventItem({
  id,
  title,
  description,
  date,
  duration,
  location,
  capacity,
  attendees,
  status,
  imageUrl,
  onViewDetails,
  onRegister
}: EventItemProps) {
  const statusVariant = {
    upcoming: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    ongoing: 'bg-green-100 text-green-800 hover:bg-green-100',
    completed: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
    myEvents: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  };

  return (
    <Card className="w-full max-w-md overflow-hidden transition-shadow hover:shadow-lg">
      {imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-bold line-clamp-2">{title}</CardTitle>
          <Badge className={statusVariant[status]}>{status}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{format(date, 'PPP')}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>{format(date, 'p')} • {duration} min</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{attendees} of {capacity} attending</span>
          <div className="ml-auto w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${Math.min(100, (attendees / capacity) * 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails?.(id)}
        >
          View Details
        </Button>
        <Button 
          size="sm"
          onClick={() => onRegister?.(id)}
          disabled={status === 'completed' || status === 'cancelled'}
        >
          Register
        </Button>
      </CardFooter>
    </Card>
  );
}
