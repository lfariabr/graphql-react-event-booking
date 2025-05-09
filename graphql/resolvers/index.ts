import Event from '../../models/Event';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

const rootValue = {
        events: async () => {
          try {
          const events = await Event.find().populate('creator');
          console.log("Found events:", events);
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
            date: new Date(args.eventInput.date),
            creator: user._id
          })
          // Step 2: save event
          const savedEvent = await event.save();
    
          // Step 3: Add event to user's createdEvents array
          user.createdEvents.push(savedEvent._id);
          await user.save();
    
          console.log("Event created:", savedEvent);
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
          console.log("Creating user:", args.userInput);
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
        }
      }

export default rootValue;
