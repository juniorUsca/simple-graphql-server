const { ApolloServer, gql } = require('apollo-server')
const { default: axios } = require('axios')
const { v4: uuid } = require('uuid')

let arrSpecies  = []

let apiVehicles = 'https://ghibliapi.herokuapp.com/vehicles'

let apiSpecies = 'https://ghibliapi.herokuapp.com/species'

const typeDefs = gql`
  type Vehicles {
    id: ID!
    name: String!
    description: String!
    vehicle_class: String!
    length: String!
    
  }
  type Species {
    id: ID!
    name: String!
    classification: String!
    eye_colors: [String!]!
    hair_colors: [String!]!
  }
  type Mutation {
    "Agregar nueva especie"
    addSpecies(
        name: String!
        classification: String!
        eye_colors: [String!]!
        hair_colors: [String!]!
    ): Species
  }
  type Query {
    allSpecies(name: String, length: String): [Species!]!
    allVehicles(name: String, length: String): [Vehicles!]!
    vehiclesCount: Int!
    speciesCount: Int!
  }
`

const resolvers = {
    Query: {
        allSpecies: async ( root, args ) => {
          if (!args.name && !args.classification) {
            const {data: { species } }=  await axios.get(apiSpecies)
            return species
          }
        },
        allVehicles: async ( root, args ) => {
          if (!args.name && !args.classification) {
            const { data:{ vehicles } } =  await axios.get(apiVehicles)
            return vehicles
          }
        },
        vehiclesCount: async () => {
        const { data:{ species } } =  await axios.get(apiSpecies)
        return species.length
      },
      speciesCount: async () => {
        const { data:{ vehicles } } =  await axios.get(apiVehicles)
        return vehicles.length
      }
      },
      Mutation: {
        addSpecies: (root, args) => {
          const newSpecies = {id: uuid(), ...args}
          arrSpecies = arrSpecies.concat(newSpecies)
          return newSpecies
        },
      }
  }
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })
  
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
  
