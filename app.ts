import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();

const events: any[] = [];

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
      return events;
    },
    createEvent: (args: any) => {
      const event = {
        _id: Math.random().toString(),
        title: args.eventInput.title, // nested object, so we need to access it with .eventInput
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date
      }
      console.log(args); // Nested object return
      events.push(event);
      return event;
    }
  },
  graphiql: true,
}))

// app.get('/', (req, res, next) => {
//   res.send('Hello World!');
// });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

export default app;
