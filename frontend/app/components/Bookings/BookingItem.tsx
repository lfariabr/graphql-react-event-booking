import { Calendar, Clock, User, X } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { format } from 'date-fns';

interface BookingItemProps {
  id: string;
  event: {
    _id: string;
    title: string;
    description?: string;
    date: string;
    price: number;
  };
  createdAt: string;
  onCancel?: (id: string) => void;
}

export default function BookingItem({
  id,
  event,
  createdAt,
  onCancel
}: BookingItemProps) {
  return (
    <Card className="w-full max-w-md overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-bold line-clamp-2">{event.title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{format(new Date(event.date), 'PPP')}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>Booked on: {format(new Date(createdAt), 'PPP')}</span>
        </div>
        
        <div className="flex items-center text-sm font-medium">
          <span>Price: ${event.price.toFixed(2)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end pt-0">
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onCancel?.(id)}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel Booking
        </Button>
      </CardFooter>
    </Card>
  );
}