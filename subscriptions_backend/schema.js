const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Author {
    name: String!
    bookCount: Int!
    id: ID!
    born: Int
  }

  type Book {
    title: String!
    author: String!
    published: Int!
    id: ID!
  }

  type Query {
    allBooks: [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(title: String!, author: String!, published: Int!): Book!
  }

  type Subscription {
    bookAdded: Book!
  }
`;

module.exports = typeDefs;