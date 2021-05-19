const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')

let authors = [
  {
    name: 'Juanito Perez',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf31',
    born: 2012,
  },
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf32',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf33',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf34',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf35',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf36',
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['Agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'The Demon',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'Revolution'],
  },
]

const typeDefs = gql`
  enum YES_NO {
    YES
    NO
  }
  type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
    id: ID!
  }
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }
  type Mutation {
    "Agrega un nuevo libro"
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String, setBornTo: Int): Author
  }
  type Query {
    allBooks(author: String, genre: String): [Book!]!
    allAuthors(from2000: YES_NO): [Author!]!
    bookCount: Int!
    authorCount: Int!
  }
`

const resolvers = {
  Query: {
    allBooks: (root, args) => {
      if (!args.author && !args.genre) {
        return books
      }

      if (args.author)
        books = books.filter((book) => book.author === args.author)

      if (args.genre) {
        return books.filter(
          (book) => book.genres.findIndex((genre) => genre == args.genre) !== -1
        )
      }
    },
    allAuthors: (root, args) => {
      const res = authors.map((author) => {
        const bookCount = books.reduce(
          (a, book) => (book.author == author.name ? a + 1 : a),
          0
        )
        return { ...author, bookCount }
      })
      if (args.from2000) return res.filter(author => {
        if (args.from2000 === 'YES' && author.born >=2000) return true
        if (args.from2000 === 'NO' && author.born < 2000) return true
      })
      return res
    },

    bookCount: () => books.length,
    authorCount: () => authors.length,
  },
  Mutation: {
    addBook: (root, args) => {
      if (!authors.find((author) => author.name === args.author)) {
        const newAuthor = {
          name: args.author,
          id: uuid(),
        }
        authors = authors.concat(newAuthor)
      }

      const book = { ...args, id: uuid() }
      books = books.concat(book)
      return book
    },

    editAuthor: (root, args) => {
      const author = authors.find((a) => a.name === args.name)
      console.log(author)
      if (!author) {
        return null
      }
      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map((author) =>
        author.name === updatedAuthor.name ? updatedAuthor : author
      )
      return updatedAuthor
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
