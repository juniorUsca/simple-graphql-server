const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios').default;

let animus = []
const url = 'https://kitsu.io/api/edge/anime'

const fetchAnime = () => {
    return axios.get(url).then(json => json.data.data).catch(error => [])
}

const filterAnime = (args) => {
    return axios.get(url + '/' + args.id).then(json => json.data).catch(error => [])
}

const countAnime = () => {
    return axios.get(url).then(json => json.data.data.length).catch(error => 0)
}

const typeDefs = gql`
  type Anime {
    id: String!
    type: String!
    links: [String]
    attributes: [String!]!
    relationships: [String!]!
    slug: String!
    synopsis: String!
    description: String!
    posterImage: [String!]!
  }
  type Mutation {
    "Add new Anime"
    addAnime(
      id: Int!
      type: String!
      slug: String!
      synopsis: String!
    ): Anime
  }
  type Query {
   "Add new Anime"
    allAnime(name: String, type: String): [Anime!]!
    findAnime(id: String): Anime!
    animeCount: Int!
  }
`

// let url="https://rickandmortyapi.com/api/character"

const resolvers = {
    Query: {
        allAnime: (root, args) => fetchAnime(),
        findAnime: (root, args) => filterAnime(args),
        animeCount: () => countAnime(),
    },
    Mutation: {
        addAnime: (root, args) => {
            const anime = {
                ...args,
                id: uuid()
            }
            animus = animus.concat(anime)
            return anime
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
