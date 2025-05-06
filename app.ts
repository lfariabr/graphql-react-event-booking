import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type RootQuery {
      events: [String!]! 
    }
    type RootMutation {
      createEvent(name: String!): String!
      
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return ['Romantic Cooking', 'Running', 'Swimming']
    },
    createEvent: (args: any) => {
      const eventName = args.name;
      return eventName;
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
