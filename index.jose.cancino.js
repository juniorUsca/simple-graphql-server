const { ApolloServer, gql } = require('apollo-server')
const { default: axios } = require('axios')
const { v4: uuid } = require('uuid')

const url="https://api.pokemontcg.io/v2/cards"

var listaPokemon = []

const typeDefs = gql`
enum f_d {
  Fuerte
  Debil
}
  type pokemon {
    id: ID!
    name: String!
    supertype: String!
    subtypes: [String] 
    level: Int!
    hp: Int!
    
  }
  type Mutation {
    "Agrega un nuevo pokemon"
    addPokemon(
      id: ID!
      name: String!
      supertype: String!
      subtypes: [String]
      level: Int!
      hp: Int!
      
    ): pokemon
  }
  type Query {
    allPokemon:[pokemon!]!
    pokemonrango(rango: f_d): [pokemon!]!
    totalpokemon: Int!
  }
`

const resolvers = {
  Query: {
    allPokemon: () =>getAllPokemon(),
 
    pokemonrango: async (root, args) => {
        listaPokemon =  await getAllPokemon()
          
        if (args.rango) return listaPokemon.filter(pokemon => {
          if (args.rango === 'Fuerte' && pokemon.level >= 50) return true
          if (args.rango === 'Debil' && pokemon.level <  50 ) return true
        })
        return listaPokemon
      },
      totalpokemon: async () => {
        listaPokemon =  await getAllPokemon()
        listaPokemon.length}
        ,
},
  Mutation: {
    addPokemon: async (root, args) =>{
      listaPokemon = await getAllPokemon()

      const newPokemon = {
        id: uuid(),
        name: args.name,
        supertype: args.supertype,
        subtypes: args.subtypes,
        level: args.level,
        hp: args.hp,
      }

      const nuevo = [...listaPokemon, newPokemon]
      listaPokemon = listaPokemon.concat(nuevo)
      return nuevo
    }
  }
}

const getAllPokemon = async ()=>{
  const { data } = await axios(url)
  return data.data
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
