# Build a complete app with GraphQL, Node.js, MongoDB and React

## Progress
- [x] What is GraphQL?
- [x] API Design and project setup
- [x] Schemas and Resolvers
- [x] Types and Data
- [x] Mongo DB
- [x] Adding relations
- [x] Dynamic relations
- [x] Adding Booking
- [ ] Refactoring our code

...

## 1. What is GraphQL?
https://www.youtube.com/watch?v=7giZGFDGnkc&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=2

## 2. API Design and project setup:
https://www.youtube.com/watch?v=yvEEeKMuxn0&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=3

## 3. Schemas and Resolvers:
https://www.youtube.com/watch?v=LXTyzk2uud0&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=3

## 4. Types & Data
https://www.youtube.com/watch?v=6YlXANbXt0g&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=4

## 5. Mongo DB
https://www.youtube.com/watch?v=sOUNgOx0GcU&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=5 (22m59s)

## 6. Adding relations
https://www.youtube.com/watch?v=MRrcUQhZwBc&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=6 (14m47s)

## 7. Dynamic relations
https://www.youtube.com/watch?v=bgq7FRSPDpI&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=7

## 8. Adding Booking
https://www.youtube.com/watch?v=WcyYYD5xkuQ&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=8

## 9. Refactoring our code
https://www.youtube.com/watch?v=6y44oPKfqXU&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=9

# Queries
query {
  events {
    title
    description
    price
    date
    creator{
      email
    }
  }
}

query {
  bookings {
    event {
      _id
      title
      description
      price
      date
      creator{
        _id
        email
      }
    },
    _id,
    createdAt
    user {
      _id
      email
    },
    updatedAt
  }
}

# Mutations
mutation {
  createEvent (eventInput: {
    title: "Ok",
    description: "Testing",
    price: 9.99,
    date: "2025-05-06T08:04:07.079Z",
    creator: "681bf7bf5d3bfdb78fe11959"
  }) {
    _id
    title
    description
    price
    date
  }
}

mutation {
  createUser (userInput:{
    email: "test@test.com",
    password: "test"
  }) {
    _id
    email
    password
  }
}

mutation {
  bookEvent (
    eventId: "682027ac50d02decbf1f2d01"
    userId: "681bf7bf5d3bfdb78fe11959"
  ) {
    _id
    createdAt
  }
}

mutation {
  cancelBooking(bookingId: "682037d3c9fe8de50017a14a") {
    _id
    title
    description
    price
    date
    creator {
      password
    }
  }
}

# Redis
redis-server /opt/homebrew/etc/redis.dev --daemonize yes
brew services start redis
