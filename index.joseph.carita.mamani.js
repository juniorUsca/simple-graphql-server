const { ApolloServer, gql } = require('apollo-server')
const { default: axios } = require('axios')
const { v4: uuid } = require('uuid')

let Civilizations_a  = []
const apiCivilizations = 'https://age-of-empires-2-api.herokuapp.com/api/v1/civilizations'
const apiTechnologies = 'https://age-of-empires-2-api.herokuapp.com/api/v1/technologies'

const typeDefs = gql`
  type Civilations {
    id:ID!
    name:String!
    expansion: String!
    army_type:String!
    team_bonus:String!
    civilization_bonus:String!
  }
  type Technologi {
    id:ID!
    name:String!
    expansion:String!
    age:String!
    build_time:Int!
  }
  type Mutation {
    "Add new Civilizations"
    addCivilations(
      name:String!
      expansion: String!
      army_type:String!
      team_bonus:String!
      civilization_bonus:String!
    ): Civilations
  }
  type Query {
    allCivilizations(name: String, expansion: String): [Civilations!]!
    allTechnologies(name: String, expansion: String): [Technologi!]!
    civilizationsCount: Int!
    technologiesCount: Int!
  }
`
const resolvers = {
  Query: {
    allCivilizations: async (root, args) => {
        if (!args.name && !args.expansion) {
          const {data: { civilizations } }=  await axios.get(apiCivilizations)
          return civilizations
        }
      },
      allTechnologies: async (root,args) => {
        if (!args.name && !args.expansion) {
          const { data:{ technologies } } =  await axios.get(apiTechnologies)
          return technologies
        }
      },
    civilizationsCount: async () => {
      const { data:{ civilizations } } =  await axios.get(apiCivilizations)
      return civilizations.length
    },
    technologiesCount: async () => {
      const { data:{ technologies } } =  await axios.get(apiTechnologies)
      return technologies.length
    }
    },
    Mutation: {
      addCivilations: (root, args) => {
        const newCivilizations = {id: uuid(), ...args}
        Civilizations_a = Civilizations_a.concat(newCivilizations)
        return newCivilizations
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
