# Queries
```graphql
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
```

```graphql
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
```
### Retrieve Token
```graphql
query {
  login(email: "test@test.com", password: "test") {
    userId
    token
    tokenExpiration
  }
}
```

# Mutations
```graphql
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
```

```graphql
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
```

```graphql
mutation {
  bookEvent (
    eventId: "682027ac50d02decbf1f2d01"
    userId: "681bf7bf5d3bfdb78fe11959"
  ) {
    _id
    createdAt
  }
}
```

```graphql
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
```