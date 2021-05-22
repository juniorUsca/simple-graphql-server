const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios').default

const url = 'https://age-of-empires-2-api.herokuapp.com/api/v1/'
let units = []

const typeDefs = gql`
    enum EXPANSION {
        The_Conquerors
        Age_of_Kings
        Forgotten_Empires
        Rise_of_Rajas
        African_Kingdoms
    }
    type Unit {
        id: ID!
        name: String!
        description: String!
        age: String!
        build_time: String!
        attack: String!
        armor: String!
    }
    type Character {
        id: ID!
        name: String!
        gender: String!
        status: String!
        species: String!
        episode: [String!]!
    }
    type Mutation {
        "Agrega una nueva unidad"
        addUnit(
            name: String!
            description: String!
            age: String!
            build_time: String!
            attack: String!
            armor: String!
        ): Unit
    }
    type Civilization{
        id: ID!
        name: String!
        expansion: String!
        army_type: String!
        team_bonus: String!
    }
    type Query {
        allCivilizations(expansion: EXPANSION): [Civilization!]!
        getCivilization(id: Int): Civilization!
        allUnits: [Unit!]!
    }
`

const resolvers = {
    Query: {
        allCivilizations: async (root,args) => {
            if(!args.expansion){
                const { data } = await axios(`${url}civilizations`)
                const res = await data.civilizations.map((civilization) => {
                    return {
                        id: civilization.id,
                        name: civilization.name,
                        expansion: civilization.expansion,
                        army_type: civilization.army_type,
                        team_bonus: civilization.team_bonus,
                    }
                })
                return res
            }
            if(args.expansion){
                const { data } = await axios(`${url}civilizations`)
                const res = await data.civilizations.filter((civilization)=>{
                    if(civilization.expansion==args.expansion.replace(/_/g," ")){
                        return {
                            id: civilization.id,
                            name: civilization.name,
                            expansion: civilization.expansion,
                            army_type: civilization.army_type,
                            team_bonus: civilization.team_bonus,
                        }
                    }
                })
                return res
            }
        },
        getCivilization: async (root, args) => {
            const { data } = await axios(`${url}civilization/${args.id}`)
            const res = {
                id: data.id,
                name: data.name,
                expansion: data.expansion,
                army_type: data.army_type,
                team_bonus: data.team_bonus,
            }
            return res
        },
        allUnits: async () => {
            const { data } = await axios(`${url}units`)
            const res = await data.units.map((unit) => {
                console.log(typeof unit.build_time)
                return {
                    id: unit.id,
                    name: unit.name,
                    description: unit.description,
                    age: unit.age,
                    build_time: String(unit.build_time),
                    attack: String(unit.attack),
                    armor: unit.armor,

                }
            })
            return res
        },
    },
    Mutation: {
        addUnit: (root, args) => {
            const newId = uuid()
            const newUnit =  {
                id: newId,
                name: args.name,
                description: args.description,
                age: args.age,
                build_time: String(args.build_time),
                attack: String(args.attack),
                armor: args.armor,
            }
            units.push(newUnit)
            return newUnit
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
