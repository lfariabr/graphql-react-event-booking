import Event from '../../models/Event';
import User from '../../models/User';
import Booking from '../../models/Booking';
import bcrypt from 'bcryptjs';

// TODO
// Optimize by using .lean() and maybe add const creatorIds = events.map(event => event.creator._id)
            // const createdEvents = await User.find({ _id: { $in: creatorIds } })
            // const enrichedEvents = events.map(event => {
            //  const userCreatedEvents = createdEvents.filter(ce => ce.creator.equals(event.creator._id));
            //  return {
            //    ...event,
            //    creator: {
            //      ...event.creator,
            //      createdEvents: userCreatedEvents
            //    }
            //  }
            // });

const rootValue = {
        events: async () => {
          try {
            // TODO
          const events = await Event.find().populate({
            path: 'creator',
            populate: {
              path: 'createdEvents',
              model: 'Event'
            }
          });
          // console.log("Found events:", events);
          return events.map((event: any) => {
            const eventObj = event.toObject();
            return {
              ...eventObj,
              _id: eventObj._id.toString(),
              creator: eventObj.creator // already populated User object
            }
          });
        } catch (error: any) {
          console.error("Error fetching events:", error?.message);
          throw error;
        }
        },
        users: async () => {
          try {
          return User.find();
        } catch (error: any) {
          console.error("Error fetching users:", error?.message);
          throw error;
        }
        },
        bookings: async () => {
          try {
            const bookings = await Booking.find()
            .populate({
              path: 'event',
              populate: {
                path: 'creator',
              }
            })
            .populate('user');

            console.log("Found bookings:", bookings);
            return bookings.map((booking: any) => {
              const bookingObj = booking.toObject();
              return {
                ...bookingObj,
                _id: bookingObj._id.toString(),
                event: {
                  ...bookingObj.event,
                  _id: bookingObj.event?._id.toString()
                },
                user: {
                  ...bookingObj.user,
                  _id: bookingObj.user?._id.toString()
                },
                createdAt: bookingObj.createdAt.toISOString(),
                updatedAt: bookingObj.updatedAt.toISOString()
              }
            });
          } catch (error: any) {
            console.error("Error fetching bookings:", error?.message);
            throw error;
          }
        },
        createEvent: async(args: any) => {
          try {
          // Step 1: Find user by ID
          const user = await User.findById(args.eventInput.creator);
          if (!user) {
            throw new Error("User not found!");
          }
          // Step 2: create event object
            const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date).toISOString(),
            creator: user._id
          })
          // Step 2: save event
          const savedEvent = await event.save();
    
          // Step 3: Add event to user's createdEvents array
          user.createdEvents.push(savedEvent._id);
          await user.save();
    
          // console.log("Event created:", savedEvent);
          const eventData = savedEvent.toObject();
          return {
            ...eventData,
            _id: eventData._id.toString(),
            creator: {
              ...user,
              _id: user._id.toString()
            }
          };
          } catch (error: any) {
            console.error("Error creating event:", error?.message);
            throw error;
          }
        },
        createUser: async (args: any) => {
          // console.log("Creating user:", args.userInput);
          try {
          const existingUser = await User.findOne({ email: args.userInput.email });
          if (existingUser) {
            throw new Error("User already exists.")
          }       
          const hashPassword = await bcrypt.hash(args.userInput.password, 12);
          const newUser = new User({
              email: args.userInput.email,
              password: hashPassword
            });
          const result = await newUser.save()
          const userObj = result.toObject(); // use to replace js _doc
          return {
                ...userObj,
                _id: userObj._id.toString(),
                password: null
              };
          } catch (error: any) {
            console.error("Error creating user:", error?.message);
            if (error?.message === "User already exists.") {
              throw new Error(error?.message);
            }
            throw new Error("Creating user failed!");
          }
        },
        bookEvent: async (args: any) => {
          try {
            const event = await Event.findById(args.eventId);
            if (!event) {
              throw new Error("Event not found!");
            }
            const user = await User.findById(args.userId);
            if (!user) {
              throw new Error("User not found!");
            }

            const booking = new Booking({
            event: event._id,
            user: user._id
          });

          const result = await booking.save();
          const populateBooking = await Booking.findById(result._id)
            .populate('event')
            .populate('user');
          
          if (!populateBooking) {
            throw new Error("Booking not found!");
          }
          
          const bookingObj = populateBooking.toObject();
          return {
            ...bookingObj,
            _id: bookingObj._id.toString(),
            event: {
              ...bookingObj.event,
              _id: bookingObj.event?._id.toString()
            },
            user: {
              ...bookingObj.user,
              _id: bookingObj.user?._id.toString()
            },
            createdAt: bookingObj.createdAt.toISOString(),
            updatedAt: bookingObj.updatedAt.toISOString()
          };
          } catch (error: any) {
            console.error("Error booking event:", error?.message);
            throw error;
          }
        },
        cancelBooking: async (args: any) => {
          try {
            // 1. Find and delete the booking
            const booking = await Booking.findByIdAndDelete(args.bookingId);
            if (!booking) throw new Error("Booking not found!");
        
            // 2. Find the event
            const event = await Event.findById(booking.event);
            if (!event) throw new Error("Event not found!");
        
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
            // event.creator = undefined;
            await event.save();
        
            // 5. Return event object
            const eventObj = event.toObject();
            let creatorObj = null;

            if (eventCreatorId) {
              const eventCreator = await User.findById(eventCreatorId);
              if (eventCreator) {
                creatorObj = {
                  ...eventCreator.toObject(),
                  _id: eventCreator._id.toString(),
                  password: null // always mask password
                };
              }
            }
            console.log("Event canceled:", eventObj);
            return {
              ...eventObj,
              _id: eventObj._id.toString(),
              creator: creatorObj,
              date: eventObj.date.toISOString()
            };
          } catch (err: any) {
            console.error("Error canceling booking:", err?.message);
            throw err;
          }
        }
      }

export default rootValue;
