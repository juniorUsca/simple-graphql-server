const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios').default;

let characters=[]

const typeDefs = gql` 
  type BreakingBadApi {
    characters: String!    
    episodes: String!
    quotes: String!
    deaths: String!  
  }
  type Mutation {
    "Agrega un nueva informacion a la api"
    addBreakingBadApi(
    characters: String!    
    episodes: String!
    quotes: String!
    deaths: String!  
    ): Characters   
  }
  type Query {
   "Agrega un nueva informacion la api "
    allBreakingBadApi(episodes: String, deaths: String): [BreakingBadApi!]!
    breakingBadApiCount: Int!
  }
`
let Urlapi="https://www.breakingbadapi.com/api/"
const resolvers = {
    Query: {
        allBreakingBadApi: (root, args) => {
            if (!args.episodes && !args.deaths) {
              const {data: { caps } }=  await axios.get(Urlapi)
              return caps
            }
          },
          BreakingBadApiCount: async () => {
              const { data:{ caps } } =  await axios.get(Urlapi)
              return caps.length
        }
      },
    Mutation: {
        addBreakingBadApi: (root, args) => {
          const newCap = { ...args, id: uuid() }
          characters = characters.concat(newCap)
          return newCap
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
    
