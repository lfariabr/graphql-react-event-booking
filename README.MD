# Build a complete app with GraphQL, Node.js, MongoDB and React

## Progress
- [x] What is GraphQL?
- [x] API Design and project setup
- [x] Schemas and Resolvers
- [x] Types and Data
- [x] Mongo DB
- [ ] Adding relations

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

mutation {
  createEvent (eventInput: {
    title: "Ok",
    description: "Testing",
    price: 9.99,
    date: "2025-05-06T08:04:07.079Z"
  }) {
    _id
    title
    description
    price
    date
  }
}

query {
  events {
    _id
    title
    description
    price
    date
  }
}