import dateToString from '../../helpers/date';

export const transformEvent = (event: any) => {
  const eventObj = event.toObject ? event.toObject() : event;
  return {
    ...eventObj,
    _id: eventObj._id.toString(),
    creator: eventObj.creator,
    ...(eventObj.date && { date: dateToString(eventObj.date) })
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
    password: null // Always mask password
  };
};
