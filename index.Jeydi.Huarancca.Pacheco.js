const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')
const { v4: uuid } = require('uuid')

let episode = [
  {
    id: 1,
    name: "Pilot",
    air_date: "December 2, 2013",
    episode: "S01E01",
  },
  {
    id: 2,
    name: 'Lawnmower Dog',
    air_date: "December 9, 2013",
    episode: "S01E02",
  },
  {
    id: 3,
    name: "Anatomy Park",
    air_date: "December 16, 2013",
    episode: "S01E03",
  },
]

let character = [
  {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
  },
  {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
  },
  {
    id: 3,
    name: "Summer Smith",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Female",
  },
]

const typeDefs = gql`
  enum GENDER {
    Male
    Female
  }
  type episode {
    name: String!
    air_date: Int
    episode: String!
    id: ID!
  }
  type character {
    name: String!
    id: ID!
    status: String!
    species: String!
    type: String!
    gender: String!
    apisodeCount: Int
  }
  type Mutation {
    "Agrega un nuevo episodio"
    addepisode(
      name: String!
      air_date: String!
      episode: String!
    ): episode
    editcharacter(name: String, gender: String): character
  }
  type Query {
    allepisodes(name: String, air_date: Int): [episode!]!
    allcharacters(gender: String): [character!]!
    apisodeCount: Int!
  }
`

const resolvers = {
  Query: {
    allepisodes: (root, args) => {
      if (!args.name && !args.episode) {
        return episode
      }

      if (args.name)
        episode = episodes.filter((episode) => episode.name === args.name)

      if (args.air_date) {
        return episode.filter(
          (episode) => episode.air_date.findIndex((air_date) => air_date == args.air_date) !== -1
        )
      }
    },
    allcharacters: (root, args) => {
      const res = characters.map((character) => {
        const episodeCount = episodes.reduce(
          (a, episode) => (episode.character == character.name ? a + 1 : a),
          0
        )
        return { ...character, episodeCount }
      })
      if (args.gender) return res.filter(character => {
        if (args.gender == "Male" ) return true
        if (args.gender == "Female") return true
      })
      return res
    },

    episodeCount: () => episodes.length,
    characterCount: () => characters.length,
  },
  Mutation: {
    addepisode: (root, args) => {
      if (!character.find((character) => character.name === args.character)) {
        const newcharacter = {
          name: args.character,
          id: uuid(),
        }
        characters = characters.concat(newcharacter)
      }

      const episode = { ...args, id: uuid() }
      episodes = episodes.concat(episode)
      return episode
    },

    editcharacter: (root, args) => {
      const character = characters.find((a) => a.name === args.name)
      console.log(character)
      if (!character) {
        return null
      }
      const updatedcharacter = { ...character, gender: args.setgenderTo }
      characters = characters.map((character) =>
        character.name === updatedcharacter.name ? updatedcharacter : character
      )
      return updatedcharacter
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

