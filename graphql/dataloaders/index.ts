import DataLoader from 'dataloader';
import Event from '../../models/Event';
import User from '../../models/User';
import Booking from '../../models/Booking';
import { transformEvent, transformBooking, transformUser } from '../resolvers/transformers';

export function createLoaders() {
    // Event loader
    const eventLoader = new DataLoader(async (eventIds: readonly string[]) => {
        try {
            const events = await Event.find({ _id: { $in: eventIds } });
            const eventMap = events.reduce((map, event) => {
                map[event._id.toString()] = transformEvent(event);
                return map;
            }, {} as Record<string, Event>);
            return eventIds.map((eventId) => eventMap[eventId]);
        } catch (error) {
            console.error("Error loading events:", error);
            throw error;
        }
    });

    // User loader
    const userLoader = new DataLoader(async (userIds: readonly string[]) => {
        try {
            const users = await User.find({ _id: { $in: userIds } });
            const userMap = users.reduce((map, user) => {
                map[user._id.toString()] = transformUser(user);
                return map;
            }, {} as Record<string, User>);
            return userIds.map((userId) => userMap[userId]);
        } catch (error) {
            console.error("Error loading users:", error);
            throw error;
        }
    });

    // Booking loader
    const bookingLoader = new DataLoader(async (bookingIds: readonly string[]) => {
        try {
            const bookings = await Booking.find({ _id: { $in: bookingIds } });
            const bookingMap = bookings.reduce((map, booking) => {
                map[booking._id.toString()] = transformBooking(booking);
                return map;
            }, {} as Record<string, Booking>);
            return bookingIds.map((bookingId) => bookingMap[bookingId]);
        } catch (error) {
            console.error("Error loading bookings:", error);
            throw error;
        }
    });

    // Bookings by event loader
    const bookingsByEventLoader = new DataLoader(async (eventIds: readonly string[]) => {
        try {
          const bookings = await Booking.find({ event: { $in: eventIds } });
          
          // Group bookings by event ID
          const bookingsByEvent = eventIds.map(eventId => 
            bookings
              .filter(booking => booking.event.toString() === eventId.toString())
              .map(transformBooking)
          );
          
          return bookingsByEvent;
        } catch (error) {
          console.error('Error loading bookings by event:', error);
          throw error;
        }
      });

    return {
        eventLoader,
        userLoader,
        bookingLoader,
        bookingsByEventLoader
    };
}