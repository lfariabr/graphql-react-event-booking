import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import Event from './models/Event';
import User from './models/User';

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }
    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [Event!]!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: ID!
    }

    input UserInput {
      email: String!
      password: String!
    }
    
    type RootQuery {
      events: [Event!]! 
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event.find().then(events => {
        return events.map(event => {
          const formattedDate = typeof event.date === 'number'
          ? new Date(event.date).toISOString()
          : event.date instanceof Date
        ? event.date.toISOString()
        : event.date;
        return {
          _id: event._id.toString(),
          title: event.title,
          description: event.description,
          price: event.price,
          date: formattedDate,
          creator: event.creator
        };
      });
    });
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
        console.error("Error creating event:", error.message);
        throw error;
      }
    },
    createUser: async (args: any) => {
      try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error("User already exists.")
      }       
      const hashPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
          email: args.userInput.email,
          password: hashPassword
        });
      return newUser.save()
        .then((result: any) => {
          return {
            ...result._doc,
            _id: result._id.toString(),
            password: null
          };
      })
      .catch(err => {
        console.error("Error creating user:", err);
        if (err.message === "User already exists.") {
          throw new Error(err.message);
        }
        throw new Error("Creating user failed!");
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
    },
  },
  graphiql: true,
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB}.qjxuqu5.mongodb.net/?retryWrites=true&w=majority&appName=EventReactGraphQL`)
  .then(() => {
    console.log('Connected to MongoDB! 🎉');
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export default app;
