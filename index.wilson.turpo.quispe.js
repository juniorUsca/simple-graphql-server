const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios');

const url="https://rickandmortyapi.com/api/character"

var charactersArray = []

const typeDefs = gql`
  enum CharacterStatus {
    Alive
    Dead
    unknown
  }
  type Character {
    id: ID!
    name: String!
    status: CharacterStatus!
    species: String!
    gender: String!
    episode: [String!]!
    url: String!
  }
  type Mutation {
    "Agrega un nuevo Character"
    addCharacter(
      id: ID!
      name: String!
      status: CharacterStatus!
      species: String!
      gender: String!
      episode: [String!]!
      url: String!
    ): Character
  }
  type Query {
    characters: [Character!]!
    character(id:ID!): Character!
    characterByStatus(status:CharacterStatus!): [Character!]!
  }
`

const resolvers = {
  Query: {
    characters: () => getAllCharacters(),
    character: (root, args)=> {
      const { id } = args
      return getOneCharacter(id)
    },
    characterByStatus: (root, args)=>{
      const { status } = args
      return getCharacterByStatus(status)
    }
  },
  Mutation: {
    addCharacter: async (root, args) =>{
      charactersArray = await getAllCharacters()

      const newCharacter = {
        id: uuid(),
        name: args.name,
        status: args.status,
        species: args.species,
        gender: args.gender,
        episode: args.episode,
        url: args.url
      }

      const characterArrayLast = [...charactersArray, newCharacter]
      console.log(characterArrayLast)
      return newCharacter
    }
  }
}

const getAllCharacters = async ()=>{
    const { data } = await axios(url)
    return data.results
}

const getOneCharacter = async (id)=>{
  const  {data}  = await axios(`${url}/${id}`)
  return data
}

const getCharacterByStatus = async (status) =>{
  const  {data}  = await axios(`${url}/?status=${status}`)
  return data.results
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at: ${url}`)
})
