import Booking from '../../models/Booking';
import Event from '../../models/Event';
import User from '../../models/User';
import { transformBooking, transformEvent } from './transformers';

export const bookingResolvers = {
  bookings: async (args: any, context: any) => {
    if (!context.req.isAuth) {
      throw new Error("Sorry to inform you, but you are not authorized! :-(");
    }
    try {
      const bookings = await Booking.find()
        .populate({
          path: 'event',
          populate: {
            path: 'creator',
          }
        })
        .populate('user');

      return bookings.map((booking: any) => transformBooking(booking));
    } catch (error: any) {
      console.error("Error fetching bookings:", error?.message);
      throw error;
    }
  },

  bookEvent: async (args: any, context: any) => {
    if (!context.req.isAuth) {
      throw new Error("Sorry to inform you, but you are not authorized! :-(");
    }
    try {
      const event = await Event.findById(args.eventId);
      if (!event) {
        throw new Error("Sorry to inform you, but the event was not found! :-(");
      }

      const user = await User.findById(args.userId);
      if (!user) {
        throw new Error("Sorry to inform you, but the user was not found! :-(");
      }

      const booking = new Booking({
        event: event._id,
        user: context.req.userId
      });

      const result = await booking.save();
      const populateBooking = await Booking.findById(result._id)
        .populate('event')
        .populate('user');
      
      if (!populateBooking) {
        throw new Error("Sorry to inform you, but the booking was not found! :-(");
      }
      
      return transformBooking(populateBooking);
    } catch (error: any) {
      console.error("Error booking event:", error?.message);
      throw error;
    }
  },

  cancelBooking: async (args: any, context: any) => {
    if (!context.req.isAuth) {
      throw new Error("Sorry to inform you, but you are not authorized! :-(");
    }
    try {
      // 1. Find and delete the booking
      const booking = await Booking.findByIdAndDelete(args.bookingId);
      if (!booking) throw new Error("Sorry to inform you, but the booking was not found! :-(");
  
      // 2. Find the event
      const event = await Event.findById(booking.event);
      if (!event) throw new Error("Sorry to inform you, but the event was not found! :-(");
  
      // 3. Get creator ID before modifying event
      const eventCreatorId = event.creator;
      if (eventCreatorId) {
        const eventCreator = await User.findById(eventCreatorId);
        if (eventCreator) {
          eventCreator.createdEvents = eventCreator.createdEvents.filter(
            (eventId: any) => eventId.toString() !== event._id.toString()
          );
          await eventCreator.save();
        } else {
          console.warn("Event creator not found in DB, skipping removal from createdEvents.");
        }
      }
  
      // 4. Remove creator from event and save
      await event.save();
  
      // 5. Return event object
      return transformEvent(event);
    } catch (error: any) {
      console.error("Error canceling booking:", error?.message);
      throw error;
    }
  }
};

export default bookingResolvers;