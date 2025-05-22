import Event from '../../models/Event';
import User from '../../models/User';
import { transformEvent, transformUser } from './transformers';
import dateToString from '../../helpers/date';

export const eventResolvers = {
  events: async () => {
    try {
      const events = await Event.find().populate('creator');
      // const events = await Event.find();
      
      return events.map((event: any) => {
        const eventObj = event.toObject ? event.toObject() : event;
        
        let creator = null;
        if (eventObj.creator) {
          if (typeof eventObj.creator === 'object' && eventObj.creator.email) {
            creator = {
              _id: eventObj.creator._id.toString(),
              email: eventObj.creator.email,
              name: eventObj.creator.name || eventObj.creator.email.split('@')[0]
            };
          } 
        }
        
        return {
          _id: eventObj._id.toString(),
          title: eventObj.title,
          description: eventObj.description,
          price: eventObj.price,
          date: eventObj.date ? dateToString(eventObj.date) : new Date().toISOString(),
          creator: creator,
          createdAt: eventObj.createdAt ? dateToString(eventObj.createdAt) : new Date().toISOString(),
          updatedAt: eventObj.updatedAt ? dateToString(eventObj.updatedAt) : new Date().toISOString()
        };
      });
    } catch (error: any) {
      console.error("Error fetching events:", error?.message);
      throw error;
    }
  },

  createEvent: async (args: any, context: any) => {
    if (!context.req.isAuth) {
      throw new Error("Sorry to inform you, but you are not authorized! :-(");
    }
    try {
      const userId = context.req.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Sorry to inform you, but the authenticated user was not found! :-(");
      }
      
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: userId
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
  },
  Event : {
    creator: async (parent: any, args: any, context: any) => {
      console.log('FULL CONTEXT:', JSON.stringify(context));
      try {
          if (!parent.creator) return null;
          
          const creatorId = typeof parent.creator === 'object' 
            ? parent.creator._id.toString() 
            : parent.creator.toString();
          
          return context.loaders.userLoader.load(creatorId);
      } catch (error: any) {
        console.error(`Error resolving creator for event ${parent._id}:`, error);
        return null;
      }
    }
  }
};

export default eventResolvers;