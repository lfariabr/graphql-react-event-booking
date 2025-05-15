import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Booking {
      _id: ID!
      event: Event!
      user: User!
      createdAt: String!
      updatedAt: String!
    }

    type Event {    
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User
    }

    type User {
      _id: ID!
      email: String!
      name: String!
      password: String
      createdEvents: [Event!]!
      bookings: [Booking!]!
    }
  
    type AuthData {
      userId: ID!
      token: String!
      tokenExpiration: Int!
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
      name: String!
    }
    
    type RootQuery {
      events: [Event!]! 
      users: [User!]!
      bookings: [Booking!]!
      login(email: String!, password: String!): AuthData
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
      bookEvent(eventId: ID!, userId: ID!): Booking
      cancelBooking(bookingId: ID!): Event
      login(email: String!, password: String!): AuthData
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `);

export default schema;