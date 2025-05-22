import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import rootValue from './graphql/resolvers';
import schema from './graphql/schema';
import dotenv from 'dotenv';
import { isAuth } from './middleware/isAuth';
import cors from 'cors';
import { createLoaders } from './graphql/dataloaders';

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(bodyParser.json());
app.use(isAuth);

// app.use('/graphql', graphqlHTTP({
//   schema,
//   rootValue,
//   graphiql: true,
//   context: ({ req }: { req: any }) => ({
//     req,
//     loaders: createLoaders(),
//   })
// }))

app.use('/graphql', graphqlHTTP(req => ({
  schema,
  rootValue,
  graphiql: true,
  context: {
    req: req,
    loaders: createLoaders()
  }
})))

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB}.qjxuqu5.mongodb.net/?retryWrites=true&w=majority&appName=EventReactGraphQL`)
  .then(() => {
    console.log('Connected to MongoDB! 🎉');
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

export default app;
