const Book = require('./models/book');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const resolvers = {
  Query: {
    allBooks: async () => Book.find({}),
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
};

module.exports = resolvers;