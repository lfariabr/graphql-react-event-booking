import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import Event from './models/Event';

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
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }
    
    type RootQuery {
      events: [Event!]! 
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      
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
          date: formattedDate
        };
      });
    });
    },
    createEvent: (args: any) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date)
      })
      return event
        .save()
        .then(result => {
          console.log(result);
          return result;
        })
        .catch(error => {
          console.log(error);
          throw error;
        });
    }
  },
  graphiql: true,
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB}.qjxuqu5.mongodb.net/?retryWrites=true&w=majority&appName=EventReactGraphQL`)
  .then(() => {
    console.log('Connected to MongoDB! 🎉');
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export default app;
