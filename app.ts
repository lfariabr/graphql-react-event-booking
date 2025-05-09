import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import rootValue from './graphql/resolvers';
import schema from './graphql/schema';

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
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
