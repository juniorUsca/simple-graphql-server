const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios');

let capitulos=[]

const typeDefs = gql` 
  enum GENDER {
    Female
    Male
  } 
  type Capitulo {
    id: String!    
    name: String!
    status: String!
    species: String!
    type: String!
    gender: String!    
    origin: [String!]!    
    image: String! 
    episode: [String!]!    
  }
  type Mutation {
    "Agrega un nuevo Capitulo"
    addCapitulo(
      id: Int!    
      name: String!
      status: String!
      species: String!
      type: String!
      gender: String!   
    ): Capitulo    
  }
  type Query {
   "Agrega un nuevo Capitulo"
    allCapitulo(author: String, genre: String): [Capitulo!]!
    findCapitulo(id: String): Capitulo!
    capituloCount: Int!
  }
`

let url="https://rickandmortyapi.com/api/character"

const resolvers = {
  Query: {
    allCapitulo: (root, args) => {

      let retorno=axios.get(url)
          .then((result) => {

            return result.data.results

          })
          .catch((error) => {
           return []
          });

      return retorno

    },
    findCapitulo: (root, args) => {

      let retorno=axios.get(url+"/"+args.id)
          .then((result) => {

            return result.data

          })
          .catch((error) => {
            return []
          });

      return retorno

    },
    capituloCount: () => {
      let retorno=axios.get(url)
          .then((result) => {

            return result.data.results

          })
          .catch((error) => {
            return []
          });

      return retorno.length
    },
  },
  Mutation: {
    addCapitulo: (root, args) => {

      const capitulo = { ...args, id: uuid() }
      capitulos = capitulos.concat(capitulo)
      return capitulo
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
