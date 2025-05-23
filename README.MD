# BooqMe

BooqMe is a modern event booking platform built with GraphQL, Node.js, MongoDB, and React. The application allows users to create events, book tickets, and manage their bookings through an intuitive interface.

## 🚀 Features

- **User Authentication** - Secure login and registration system
- **Event Creation** - Create and publish events with details
- **Event Discovery** - Browse and search for events
- **Booking Management** - Book events and manage bookings
- **Multi-booking System** - Book multiple events simultaneously
- **Real-time Feedback** - Instant visual feedback on booking status

## 💻 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **GraphQL** - API query language
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **DataLoader** - Batching and caching for GraphQL

### Frontend
- **Next.js** - React framework
- **TypeScript** - Typed JavaScript
- **React** - UI library
- **localStorage** - Client-side state management

## 🛠️ Installation

### Prerequisites
- Node.js
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/booqme.git
cd booqme
```

2. Install backend dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
MONGO_DB_USERNAME=your_mongodb_username
MONGO_DB_PASSWORD=your_mongodb_password
MONGO_DB=your_mongodb_cluster_name
JWT_SECRET=your_jwt_secret
```

## 🚀 Running the Application

### Backend
```bash
# From the root directory
npm run dev
```
The backend server will run on http://localhost:8000

### Frontend
```bash
# From the frontend directory
npm run dev
```
The frontend application will run on http://localhost:3000

## 📱 Application Architecture

### Backend Architecture
- Express server with GraphQL API endpoint
- Authentication middleware for protected routes
- MongoDB models for Users, Events, and Bookings
- GraphQL schema and resolvers for data operations
- DataLoader for efficient data fetching

### Frontend Architecture
- Next.js pages for routing
- React components for UI
- Cross-page state management with localStorage
- Multi-booking system that stores booking data locally

## 💾 Data Management

The application implements a multi-booking system that stores an array of bookings in localStorage under the key 'userBookings' while maintaining backward compatibility with the single 'latestBooking' implementation. This approach allows:

- Booking multiple events rather than restricting to a single booking
- Instant visual feedback on booking status
- Cross-page state persistence

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request