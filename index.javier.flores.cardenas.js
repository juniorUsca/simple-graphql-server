const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios');

let areas = []
let competitions = []

const getAreas = async() => {
  await axios.get('https://api.football-data.org/v2/areas', {
    headers: {
      'X-Auth-Token': 'eab61985a79244b881b27f0dadc6975a'
    }
   })
.then(function async(response) {
    response.data.areas.map((area)=>{
        let newArea = {
            id: area.id,
            name: area.name,
            parentArea: area.parentArea,
            competitions: []
        }
        areas.push(newArea)
    })
})
.catch(function (error) {
  console.log(error);
})}

const getCompetitions = async() => {
    await axios.get('https://api.football-data.org/v2/competitions/', {
      headers: {
        'X-Auth-Token': 'eab61985a79244b881b27f0dadc6975a'
      }
     })
    .then(function (response) {
        response.data.competitions.map((competition)=>{
            let area = areas.find((area)=>area.id == competition.area.id)
            let newCompetition = {
                id: competition.id,
                name: competition.name,
                code: competition.code,
                numberOfAvailableSeasons: competition.numberOfAvailableSeasons,
                area: area
            }
            area.competitions.push(newCompetition)
            competitions.push(newCompetition)
        }

    )
})
.catch(function (error) {
  console.log(error);
})}

getAreas()
getCompetitions()

const typeDefs = gql`
  type Area {
    id: Int!
    name: String!
    parentArea: String
    competitions: [Competition]
  }
  type Competition {
    id: Int!
    name: String!
    code: String
    numberOfAvailableSeasons: Int
    area: Area
  }
  input CompetitionInput {
    name: String
    code: String
    numberOfAvailableSeasons: Int
  }
  type Mutation {
    "Add new area"
    addArea(
      name: String!
      parentArea: String
      competitions: [CompetitionInput!]!
    ): Area
    "Add new competition"
    addCompetition(
      name: String!
      code: String
      numberOfAvailableSeasons: Int
      id_area: Int
    ): Competition
  }
  type Query {
    allAreas(name: String): [Area]!
    allCompetitions(name: String): [Competition]!
    getAreaById(id: Int!): Area
    getCompetitionById(id: Int!): Competition
    areasCount: Int!
    competitionsCount: Int!
  }
`

const resolvers = {
  Query: {
    allAreas: (root, args) => {
        if (!args.name) {
            return areas
        }
        return areas.filter((area) => area.name.toLowerCase().includes(args.name.toLowerCase()))
    },
    getAreaById: (root, args) => {
      return areas.find((area) => area.id == args.id)
    },
    allCompetitions: (root, args) => {
        if (!args.name) {
            return competitions
        }
        return competitions.filter((competition) => competition.name.toLowerCase().includes(args.name.toLowerCase()))
    },
    getCompetitionById: (root, args) => {
      return competitions.find((competition) => competition.id == args.id)
    },
    areasCount: () => areas.length,
    competitionsCount: () => competitions.length,
  },
  Mutation: {
    addArea: (root, args) => {
      let newId = areas[areas.length - 1].id + 1
      const newArea = {
        id: newId,
        name: args.name,
        parentArea: args.parentArea,
        competitions: []
      }
      areas.push(newArea)

      args.competitions.map((competition)=>{
        let newId = competitions[competitions.length - 1].id + 1
        const newCompetition = {
          id: newId,
          name: competition.name,
          code: competition.code,
          numberOfAvailableSeasons: competition.numberOfAvailableSeasons,
          area: newArea,
        }
        newArea.competitions.push(newCompetition)
        competitions.push(newCompetition)
      })
      return newArea
    },

    addCompetition: (root, args) => {
      let area = areas.find((area)=>area.id == args.id_area)
      let newId = competitions[competitions.length - 1].id + 1
      const newCompetition = {
        id: newId,
        name: args.name,
        code: args.code,
        numberOfAvailableSeasons: args.numberOfAvailableSeasons,
        area: area,
      }
      area.competitions.push(newCompetition)
      competitions.push(newCompetition)
      return newCompetition
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