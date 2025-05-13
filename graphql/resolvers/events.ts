import Event from '../../models/Event';
import User from '../../models/User';
import { transformEvent, transformUser } from './transformers';

export const eventResolvers = {
  events: async () => {
    try {
      const events = await Event.find().populate({
        path: 'creator',
        populate: {
          path: 'createdEvents',
          model: 'Event'
        }
      });
      return events.map((event: any) => transformEvent(event));
    } catch (error: any) {
      console.error("Error fetching events:", error?.message);
      throw error;
    }
  },

  createEvent: async (args: any, req: any) => {
    if (!req.isAuth) {
      throw new Error("Sorry to inform you, but you are not authorized! :-(");
    }
    try {
      const user = await User.findById(args.eventInput.creator);
      if (!user) {
        throw new Error("Sorry to inform you, but the user was not found! :-(");
      }

      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: req.userId
      });

      const savedEvent = await event.save();
      user.createdEvents.push(savedEvent._id);
      await user.save();

      return {
        ...savedEvent.toObject(),
        _id: savedEvent._id.toString(),
        creator: transformUser(user)
      };
    } catch (error: any) {
      console.error("Error creating event:", error?.message);
      throw error;
    }
  }
};

export default eventResolvers;