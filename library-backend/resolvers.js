const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
  Query: {
    allBooks: async (root, args) => {
      const filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        filter.author = author._id
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      return Book.find(filter).populate('author')
    },
    allAuthors: async () => {
      return Author.find({})
    },
    me: (root, args, { currentUser }) => currentUser,
  },

  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root._id }),
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser)
        throw new GraphQLError('not authenticated', { extensions: { code: 'UNAUTHENTICATED' } })

      if (args.title.length < 2)
        throw new GraphQLError('Book title must be at least 2 characters long', { extensions: { code: 'BAD_USER_INPUT' } })

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({ ...args, author: author._id })
      await book.save()
      return book.populate('author')
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser)
        throw new GraphQLError('not authenticated', { extensions: { code: 'UNAUTHENTICATED' } })

      const author = await Author.findOne({ name: args.name })
      if (!author)
        throw new GraphQLError('Author not found', { extensions: { code: 'BAD_USER_INPUT' } })

      author.born = args.setBornTo
      await author.save()
      return author
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError(`Creating user failed: ${error.message}`, { extensions: { code: 'BAD_USER_INPUT', error } })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret')
        throw new GraphQLError('wrong credentials', { extensions: { code: 'BAD_USER_INPUT' } })

      const userForToken = { username: user.username, id: user._id }
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
}

module.exports = resolvers