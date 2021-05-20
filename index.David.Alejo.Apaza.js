const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const fetch = require('node-fetch');

const typeDefs = gql`
  enum CharacterStatus {
      Alive
      Dead
      unknown
  }

  type Character {
      name: String
      id: ID
      image: String
      status: CharacterStatus
      episode: [String]
  }

  type Mutation {
    "Agrega un nuevo Personaje"
    addCharacter(
      id: ID
      name: String!
      status: CharacterStatus
      gender: String!
    ): Character
  }

  type Query {
    character(id: ID!): Character
    characters: [Character]
    charactersCount: Int
  }
`

const resolvers = {
  Query: {
    characters: () => fetchsCharacters(),
    character: (parent, args) => {
        const { id } = args
        return fetchsCharacter({id})
        console.log(args)
    },
    charactersCount: async(parent, args) => {
      const personajes = await fetchsCharacters()
      return personajes.length
    } 
  },
  Mutation: {
    addCharacter: async(root, args) => {
      let personajes = await fetchsCharacters()
      if (!personajes.find((personaje) => personaje.name === args.name)) {
        const newCharacter = {
          id: uuid(),
          name: args.name,
          status: args.status,
          gender: args.gender
        }
        personajes = personajes.concat(newCharacter)
        return newCharacter
      }
    },
  }
}

const fetchsCharacter = ({ id }) =>{
    return fetch(`https://rickandmortyapi.com/api/character/${id}`)
        .then(res => res.json())
}

const fetchsCharacters = () =>{
    return fetch('https://rickandmortyapi.com/api/character/')
        .then(res => res.json())
        .then(json => json.results)
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
