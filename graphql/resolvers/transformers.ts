import dateToString from '../../helpers/date';

export const transformEvent = (event: any) => {
  const eventObj = event.toObject ? event.toObject() : event;
  return {
    ...eventObj,
    _id: eventObj._id.toString(),
    // The creator field is an ObjectId reference, not a User object
    // We need to just pass the ID and let the GraphQL resolver handle the rest
    creator: eventObj.creator ? eventObj.creator.toString() : null,
    ...(eventObj.date && { date: dateToString(eventObj.date) }),
    createdAt: eventObj.createdAt ? dateToString(eventObj.createdAt) : new Date().toISOString(),
    updatedAt: eventObj.updatedAt ? dateToString(eventObj.updatedAt) : new Date().toISOString()
  };
};

export const transformBooking = (booking: any) => {
  const bookingObj = booking.toObject ? booking.toObject() : booking;
  return {
    ...bookingObj,
    _id: bookingObj._id.toString(),
    event: bookingObj.event,
    user: bookingObj.user,
    ...(bookingObj.createdAt && { createdAt: dateToString(bookingObj.createdAt) }),
    ...(bookingObj.updatedAt && { updatedAt: dateToString(bookingObj.updatedAt) })
  };
};

export const transformUser = (user: any) => {
  const userObj = user.toObject ? user.toObject() : user;
  return {
    ...userObj,
    _id: userObj._id?.toString(),
    password: null, // Always mask password
    email: userObj.email || "",
    name: userObj.name || ""
  };
};
