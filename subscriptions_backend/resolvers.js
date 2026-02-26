const Book = require('./models/book');
const Author = require('./models/author');
const { PubSub } = require('graphql-subscriptions');
const createBookCountLoader = require('./loaders/bookCountLoader');

const pubsub = new PubSub();

const resolvers = {
  Query: {
    allBooks: async () => Book.find({}),
    allAuthors: async () => Author.find({}),
  },

  Mutation: {
    addBook: async (root, args) => {
      const book = new Book({ ...args });
      try {
        await book.save();
      } catch (error) {
        throw new Error(`Saving book failed: ${error.message}`);
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book });
      return book;
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },

  Author: {
    bookCount: (root, args, context) => context.bookCountLoader.load(root.name),
  },
};

module.exports = resolvers;