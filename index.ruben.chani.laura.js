const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios').default

const url = 'https://rickandmortyapi.com/api/'
let characters = []

const typeDefs = gql`
  enum STATUS {
    alive
    dead
    unknown
  }
  enum GENDER {
    female
    male
    genderless
    unknown
  }
  type Episode {
    id: ID!
    name: String!
    air_date: String!
    episode: String!
    characters: [String!]!
    url: String!
  }
  type Character {
    id: ID!
    name: String!
    gender: String!
    status: String!
    species: String!
    episode: [String!]!
  }
  type Mutation {
    "Agrega un nuevo personaje"
    addCharacter(
      name: String!
      gender: String!
      status: String!
      species: String!
      episode: [String!]!
    ): Character
  }
  type Query {
    allCharacters(status: STATUS, gender: GENDER): [Character!]!
    getCharacter(id: Int): Character!
    allEpisodes: [Episode!]!
    getEpisode(id: Int): Episode!
  }
`

const resolvers = {
  Query: {
    allCharacters: async (root, args) => {
      if (!args.status && !args.gender){
        const { data } = await axios(`${url}character/`)
        const res = await data.results.map((character) => {
          return {
            id: character.id,
            name: character.name,
            gender: character.gender,
            status: character.status,
            species: character.species,
            episode: character.episode
          }
        })
        return res
      } 
      if (args.status && args.gender) {
        const { data } = await axios(`${url}character/?status=${args.status}&gender=${args.gender}`)
        const res = await data.results.map((character) => {
          return {
            id: character.id,
            name: character.name,
            gender: character.gender,
            status: character.status,
            species: character.species,
            episode: character.episode
          }
        })
        return res
      }
      if (args.status){
        const { data } = await axios(`${url}character/?status=${args.status}`)
        const res = await data.results.map((character) => {
          return {
            id: character.id,
            name: character.name,
            gender: character.gender,
            status: character.status,
            species: character.species,
            episode: character.episode
          }
        })
        return res
      }
      if (args.gender){
        const { data } = await axios(`${url}character/?gender=${args.gender}`)
        const res = await data.results.map((character) => {
          return {
            id: character.id,
            name: character.name,
            gender: character.gender,
            status: character.status,
            species: character.species,
            episode: character.episode
          }
        })
        return res
      }
    },
    getCharacter: async (root, args) => {
      const { data } = await axios(`${url}character/${args.id}`)
      const res = {
        id: data.id,
        name: data.name,
        gender: data.gender,
        status: data.status,
        species: data.species,
        episode: data.episode
      }
      return res
    },
    allEpisodes: async () => {
      const { data } = await axios(`${url}episode/`)
      const res = await data.results.map((episode) => {
        return {
          id: episode.id,
          name: episode.name,
          air_date: episode.air_date,
          episode: episode.episode,
          characters: episode.characters,
          url: episode.url
        }
      })
      return res
    },
    getEpisode: async (root, args) => {
      const { data } = await axios(`${url}episode/${args.id}`)
      const res = {
        id: data.id,
        name: data.name,
        air_date: data.air_date,
        episode: data.episode,
        characters: data.characters,
        url: data.url
      }
      return res
    },
  },
  Mutation: {
    addCharacter: (root, args) => {
      const newId = uuid()
      const newCharacter =  {
        id: newId,
        name: args.name,
        gender: args.gender,
        status: args.status,
        species: args.species,
        episode: args.episode
      }
      characters.push(newCharacter)
      return newCharacter
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
