const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')

let pokemon = [
  {
    "name": "bulbasaur",
    "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
    "name": "ivysaur",
    "url": "https://pokeapi.co/api/v2/pokemon/2/"
    },
    {
    "name": "venusaur",
    "url": "https://pokeapi.co/api/v2/pokemon/3/"
    },
    {
    "name": "charmander",
    "url": "https://pokeapi.co/api/v2/pokemon/4/"
    },
    {
    "name": "charmeleon",
    "url": "https://pokeapi.co/api/v2/pokemon/5/"
    },
    {
    "name": "charizard",
    "url": "https://pokeapi.co/api/v2/pokemon/6/"
    },
    {
    "name": "squirtle",
    "url": "https://pokeapi.co/api/v2/pokemon/7/"
    },
    {
    "name": "wartortle",
    "url": "https://pokeapi.co/api/v2/pokemon/8/"
    },
    {
    "name": "blastoise",
    "url": "https://pokeapi.co/api/v2/pokemon/9/"
    },
]

const typeDefs = gql`
  enum YES_NO {
    YES
    NO
  }
  type pokemon {
    name: String!
    url: String!
  }
  type Mutation {
    "Agrega un nuevo pokemon"
    addpokemon(
      name: String!
      url: String!
    ): pokemon
  }
  type Query {
    allPokemons(name: String, url: String): [pokemon!]!
    pokemonCount: Int!
  }
`

const resolvers = {
  Query: {
    allPokemonss: (root, args) => {
      if (!args.name && !args.url) {
        return pokemon
      }

      if (args.name)
        pokemon = pokemon.filter((pokemon) => pokemon.name === args.name)

    },
    pokemonCount: async() => {
        const {data} = await axios('https://pokeapi.co/api/v2/pokemon')
        return data
    },
  },
  Mutation: {
    addpokemon: (root, args) => {
      if (!pokemon.find((name) => pokemon.name === args.name)) {
        const newPokemon = {
          name: args.name,
          url: args.url
        }
        pokemon = pokemon.concat(newPokemon)
      }

      const pokemon = { ...args, name: pokemon.name }
      pokemons = pokemons.concat(pokemon)
      return pokemon
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
