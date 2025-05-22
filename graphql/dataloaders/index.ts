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
            }, {} as Record<string, any>);
            return eventIds.map((eventId) => eventMap[eventId] || null);
        } catch (error) {
            console.error("Error loading events:", error);
            throw error;
        }
    });

    // User loader
    const userLoader = new DataLoader(async (userIds: readonly string[]) => {
        try {
            console.log('User IDs requested:', userIds);
            const users = await User.find({ _id: { $in: userIds } });
            console.log('Users found:', users.map(u => ({ id: u._id.toString(), email: u.email })));
            const userMap = users.reduce((map, user) => {
                map[user._id.toString()] = transformUser(user);
                return map;
            }, {} as Record<string, any>);
            return userIds.map((userId) => userMap[userId] || null);
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
            }, {} as Record<string, any>);
            return bookingIds.map((bookingId) => bookingMap[bookingId] || null);
        } catch (error) {
            console.error("Error loading bookings:", error);
            throw error;
        }
    });

    const bookingsByEventLoader = new DataLoader(async (eventIds: readonly string[]) => {
        try {
            const bookings = await Booking.find({ event: { $in: eventIds } });
            
            return eventIds.map(eventId => {
                return bookings
                    .filter((booking: any) => booking.event?.toString() === eventId.toString())
                    .map(transformBooking);
            });
        } catch (error) {
            console.error("Error loading bookings by event:", error);
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