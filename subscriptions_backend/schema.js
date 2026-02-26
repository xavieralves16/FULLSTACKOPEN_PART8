const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Book {
    title: String!
    author: String!
    published: Int
    id: ID!
  }

  type Query {
    allBooks: [Book!]!
  }

  type Mutation {
    addBook(title: String!, author: String!, published: Int): Book!
  }

  type Subscription {
    bookAdded: Book!
  }
`;

module.exports = typeDefs;