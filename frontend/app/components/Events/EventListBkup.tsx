'use client';

import { useState } from 'react';
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import EventItem from './EventItem';

// Mock data - replace with your actual data fetching
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Tech Conference 2023',
    description: 'Annual technology conference featuring the latest in web development and AI.',
    date: new Date(2025, 5, 15, 9, 0),
    duration: 240,
    location: 'San Francisco Convention Center',
    capacity: 500,
    attendees: 327,
    status: 'upcoming' as const,
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f96d5518?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    title: 'React Workshop',
    description: 'Hands-on workshop to master React and Next.js with TypeScript.',
    date: new Date(2025, 5, 20, 14, 0),
    duration: 180,
    location: 'Online',
    capacity: 50,
    attendees: 48,
    status: 'upcoming' as const,
    imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    title: 'UI/UX Design Meetup',
    description: 'Networking event for designers and developers to discuss the latest design trends.',
    date: new Date(2025, 4, 10, 18, 30),
    duration: 120,
    location: 'Downtown Design Hub',
    capacity: 100,
    attendees: 100,
    status: 'completed' as const,
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=60',
  },
];

export default function EventList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredEvents = MOCK_EVENTS
    .filter(event => 
      (activeTab === 'all' || event.status === activeTab) &&
      (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       event.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleViewDetails = (id: string) => {
    console.log('View event details:', id);
    // Navigate to event detail page
    // router.push(`/events/${id}`);
  };

  const handleRegister = (id: string) => {
    console.log('Register for event:', id);
    // Handle registration logic
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Events</h2>
        <div className="w-full sm:w-auto">
          <Input
            type="search"
            placeholder="Search events..."
            className="w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs 
        defaultValue="upcoming" 
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Events</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventItem
                  key={event.id}
                  {...event}
                  onViewDetails={handleViewDetails}
                  onRegister={handleRegister}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'No events match your search.' 
                  : `No ${activeTab} events found.`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}