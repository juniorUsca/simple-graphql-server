const { ApolloServer, gql } = require('apollo-server')
const { default: axios } = require('axios')
const { v4: uuid } = require('uuid')

let arrPeople  = []

let apiPeople = 'https://www.swapi.tech/api/people'

let apiPlanets = 'https://www.swapi.tech/api/planets'

const typeDefs = gql
  type People {
    uid: ID!
    name: String!
    url: String!
  }
  type Planets {
    uid: ID!
    name: String!
    url: String!
  }
  type Mutation {
    "Agregar nueva persona"
    addPeople(
        uid: ID!
        name: String!
        url: String!
    ): People
  }
  type Query {
    allPeople(name: String, url: String): [People!]!
    allPlanets(name: String, url: String): [Planets!]!
    peopleCount: Int!
    planetsCount: Int!
  }


const resolvers = {
    Query: {
        allPeople: async ( root, args ) => {
          if (!args.name && !args.url) {
            const {data: { people } }=  await axios.get(apiPeople)
            return people
          }
        },
        allPlanets: async ( root, args ) => {
          if (!args.name && !args.url) {
            const { data:{ planets } } =  await axios.get(apiPlanets)
            return planets
          }
        },
        peopleCount: async () => {
        const { data:{ people } } =  await axios.get(apiPeople)
        return people.length
      },
      planetsCount: async () => {
        const { data:{ planets } } =  await axios.get(apiPlanets)
        return planets.length
      }
      },
      Mutation: {
        addPeople: (root, args) => {
          const newPeople = {uid: uuid(), ...args}
          arrPeople = arrPeople.concat(newPeople)
          return newPeople
        },
      }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  server.listen().then(({ url }) => {
    console.log(Server ready at ${url})
  })
