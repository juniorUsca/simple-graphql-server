const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const fetch = require('node-fetch');

let anime = []
let animeMutable = []

const typeDefs = gql`
type Anime {
  id: ID!
  anime: String!
  character: String!
  quote: String!
}
type AnimeMutable {
  id: ID!
  anime: String!
  character: String!
  quote: String!
}
type Mutation {
  "Agrega una nueva cita"
  addAnimeMutable(
    anime: String!
    character: String!
    quote: String!
  ): AnimeMutable
  DeleteAnimeMutable(
    id: ID!
  ): AnimeMutable
}
type Query {
  RandomQuotes: [Anime!]!
  QuotesbyAnime(anime: String): [Anime!]!
  TenRandomQuotes: [Anime!]!
  QuotesbyCharacter(character: String): [Anime!]!
}
`

const resolvers = {
  Query: {
    RandomQuotes: async() => {
      anime = []
      await fetch('https://animechan.vercel.app/api/random')
        .then(response => response.json()) 
        .then(quote =>  anime = [...anime, quote])
      return anime
    },
    QuotesbyAnime: async(root, args) => {
      anime = []
      await fetch('https://animechan.vercel.app/api/quotes/anime?title='+args.anime)
        .then(response => response.json())
        .then(quotes => anime = [...anime, ...quotes])
      return anime
    },
    TenRandomQuotes: async() => {
      anime = []
      await fetch('https://animechan.vercel.app/api/quotes')
        .then(response => response.json())
        .then(quotes => anime = [...anime, ...quotes])
      return anime
    },
    QuotesbyCharacter: async(root, args) => {
      anime = []
      await fetch('https://animechan.vercel.app/api/quotes/character?name='+args.character)
        .then(response => response.json())
        .then(quotes => anime = [...anime, ...quotes])
      return anime
    },
  },
  Mutation: {
    addAnimeMutable: (root, args) => {
      const newQuotes = {
        anime: args.anime,
        character: args.character,
        quote: args.quote,
        id: uuid(),
      }
      animeMutable = [...animeMutable, newQuotes]
      console.log(animeMutable)

      return newQuotes
    },

    DeleteAnimeMutable: (root, args) => {
      let id = args.id
      const animeMut = animeMutable.find(animeMut => animeMut.id === id)
      animeMutable = animeMutable.filter(animeM => animeM.id !== id)
      console.log(animeMutable)

      return animeMut
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
