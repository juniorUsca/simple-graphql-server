const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios').default;

let Vehicle=[]

const typeDefs = gql` 
  enum NAMES {
    ACURA
    AGRALE
    ALFA ROMEO
    AM GEN
    ASIA MOTORS
  } 
  type Vehicle {
    id: String!
    brand: String!
    name: String!
    status: String!
    origin: [String!]!    
    image: String! 
  }
  type Mutation {
    "Agrega un nuevo Vehicle"
    addVehicle(
      id: Int!    
      name: String!
      status: String!
    ): Vehicle    
  }
  type Query {
   "Agrega un nuevo Vehicle"
    allVehicle(brand: String, type: String): [Vehicle!]!
    findVehicle(id: String): Vehicle!
    vehicleCount: Int!
  }
`

let url="https://parallelum.com.br/fipe/api/v1/carros/marcas"

const resolvers = {
  Query: {
    allVehicle: (root, args) => {

      let retorno=axios(url)
          .then((result) => {

            return result.data.results

          })
          .catch((error) => {
           return []
          });

      return retorno

    },
    findVehicle: (root, args) => {

      let retorno=axios.get(url+"/"+args.id)
          .then((result) => {

            return result.data

          })
          .catch((error) => {
            return []
          });

      return retorno

    },
    vehicleCount: () => {
        let retorno=axios(url)
            .then((result) => {

                return result.data.info.count

            })
            .catch((error) => {
                return 0
            });

        return retorno
    },
  },
  Mutation: {
    addVehicle: (root, args) => {

      const vehicle = { ...args, id: uuid() }
      vehicles = vehicles.concat(vehicle)
      return vehicle
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

