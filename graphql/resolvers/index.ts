import { userResolvers } from './users';
import { eventResolvers } from './events';
import { bookingResolvers } from './bookings';


// Combine all resolvers
const rootValue = {
  ...userResolvers,
  ...eventResolvers,
  ...bookingResolvers,
  Event: eventResolvers.Event
};

export default rootValue;
