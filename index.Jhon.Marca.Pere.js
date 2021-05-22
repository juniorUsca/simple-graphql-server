const { fetch } = require('apollo-env')
const axios = require('axios');
const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')

let pokemones = []

const api = async() => {
  await axios.get(' https://api.pokemontcg.io/v2/cards')
  .then(function async(response) {response.data.data.map((cards) => {
      let Pokemon = {
        id : cards.id,
        nombre : cards.name,
        mounstro : cards.supertype,
        nivel: cards.level,
        vida : cards.hp,
        tipos : cards.types,
        raresa: cards.rarity,
        artista: cards.artist,
        imagenes : cards.images,
        
      }
      pokemones = pokemones.concat(Pokemon)
    })
  })
}
api()
     
const typeDefs = gql`
  type Pokemon {
    id : String!
    nombre : String!
    mounstro : String!
    nivel: String!
    vida : String!
    tipos : String!
    raresa: String!
    artista: String!
    imagenes : String!
  }
  type Mutation {
    "Insertar una carta nueva!"
    addPokemon(
        nombre : String!
        mounstro : String!
        nivel: String!
        vida : String!
        tipos : String!
        raresa: String!
        artista: String!
        imagenes : String!
    ): Pokemon
  }
  type Query {
    allCartas(type: String): [Pokemon!]!
    getCartaBynombre(id: String!): Pokemon
    getCartasLVLmax: [Pokemon!]!
    CartaCount: Int!
  }
`
  
const resolvers = {
  Query: {

    //retorno de todas las cartas pokemon
    allCartas: (root, args) => {
      if (!args.type) {
        return pokemones
      }
      return pokemones.filter(cards => cards.type.includes(args.type))
    },

    //retorno las cartas segun el id
    getCartaBynombre: (root, args) => {
      return pokemones.find(cards => cards.id == args.id)
    },

    getCartasLVLmax: (root, args) => {
        return pokemones.find(cards => cards.level== "157"
            );
    
    },

    //contar la cantidad de cartas
    CartaCount: () => pokemones.length,
  },
  Mutation: {
    addPokemon: (root, args) => {
      const newPokemon = {
        ...args, id: parseInt(pokemones[pokemones.length-1].id) +1
      }

      pokemones = pokemones.concat(newPokemon)
      return newPokemon
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`iniciando servidor en el puerto.. ${url}`)
})


