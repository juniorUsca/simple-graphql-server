const { ApolloServer, gql } = require('apollo-server')
//const { default: axios } = require('axios')

const axios = require('axios').default;
const { v4: uuid } = require('uuid')

//API: RICK Y MORTY

let episodes = [
  {
    id: 3,
    name: "Anatomy Park",
    air_date: "December 16, 2013",
    episode: "S01E03",
    characters: [
      "https://rickandmortyapi.com/api/character/1",
      "https://rickandmortyapi.com/api/character/2",
      "https://rickandmortyapi.com/api/character/12",
      "https://rickandmortyapi.com/api/character/17",
      "https://rickandmortyapi.com/api/character/38",
      "https://rickandmortyapi.com/api/character/45",
      "https://rickandmortyapi.com/api/character/96",
      "https://rickandmortyapi.com/api/character/97",
      "https://rickandmortyapi.com/api/character/98",
      "https://rickandmortyapi.com/api/character/99",
      "https://rickandmortyapi.com/api/character/100",
      "https://rickandmortyapi.com/api/character/101",
      "https://rickandmortyapi.com/api/character/108",
      "https://rickandmortyapi.com/api/character/112",
      "https://rickandmortyapi.com/api/character/114",
      "https://rickandmortyapi.com/api/character/169",
      "https://rickandmortyapi.com/api/character/175",
      "https://rickandmortyapi.com/api/character/186",
      "https://rickandmortyapi.com/api/character/201",
      "https://rickandmortyapi.com/api/character/268",
      "https://rickandmortyapi.com/api/character/300",
      "https://rickandmortyapi.com/api/character/302",
      "https://rickandmortyapi.com/api/character/338",
      "https://rickandmortyapi.com/api/character/356"
    ],
    url: "https://rickandmortyapi.com/api/episode/3",
    created: "2017-11-10T12:56:34.022Z"
  }
]

const typeDefs = gql`
  type Episode {
    id: ID!
    name: String!
    air_date: String!
    episode: String!
    characters: [String!]!
    url: String!
    created: String!
    updated: String
  }
  type Character {
    id: ID!
    name: String!
    status: String!
    species: String!
    type: String!
    gender: String!
    image: String!
    episode: [String!]!
    url: String!
    created: String!
  }
  type Location {
    id: ID!
    name: String!
    type: String!
    dimension: String!
    residents: [String!]!
    url: String!
    created: String!
  }
  type Mutation {
    editEpisode(episode:String, name: String, url: String): Episode
  }
  type Query {
    allEpisodes(name: String): [Episode!]!
    allCharacteresPerEpisode(idEpisode: Int!): [Character!]!
    episodesWithCharacter(idCharacter: Int): Int!
  }
`
const apiURL = "https://rickandmortyapi.com/api/"
const resolvers = {
  Query: {
    allEpisodes: async( root, args ) => {
      let episodesQuery = await axios.get(apiURL + 'episode').then((r) => {
          return r.data.results
      }).catch((error) => {
           return []
      });
      if (args.name){
        episodesQuery = episodesQuery.filter((episode) => episode.name.includes(args.name))
      }
      return episodesQuery
    },
    allCharacteresPerEpisode: async( root, args ) => {
      let characteresQuery = await axios.get(apiURL + 'character').then((r) => {
          return r.data.results
      }).catch((error) => {
           return []
      });
      characteresQuery = characteresQuery.filter((char) => char.episode.findIndex(ep => ep == (apiURL + 'character/' + args.idEpisode)) !== -1)  
      return characteresQuery
    },
    episodesWithCharacter: async( root, args ) => {
      let episodesQuery = await axios.get(apiURL + 'episode').then((r) => {
          return r.data.results
      }).catch((error) => {
           return []
      });
      const total = episodesQuery.filter((episode) => episode.characters.findIndex(ep => ep == (apiURL + 'character/' + args.idCharacter)) !== -1).count
      return total
    },
  },
  Mutation: {
    editEpisode: (root, args) => {
      const episode = episodes.find((a) => a.episode === args.episode)
      if (!episode) {
        return null
      }
      const today = new Date()
      const updatedEpisode = { ...episode, name: args.name, url: args.url, updated: today.toISOString() }
      episodes = episodes.map((episode) => episode.episode === updatedEpisode.episode ? updatedEpisode : episode)
  
      return updatedEpisode
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