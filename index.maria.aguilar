const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios').default;

let anime=[]

const typeDefs = gql` 
  enum YES_NO {
    YES
    NO
  } 
  type anime {
    id: String!    
    name: String!
    type: String!
    gender: String!    
    origin: [String!]!    
    image: String! 
    episodes: [String!]!    
  }
  type Mutation {
    "Agrega un nuevo Anime"
    addAnime(
      id: Int!    
      name: String!
      type: String!
      gender: String!   
    ): anime    
  }
  type Query {
   "Agrega un nuevo Anime"
    allAnime(director: String, genre: String): [Anime!]!
    findAnime(id: String): Anime!
    AnimeCount: Int!
  }
`

let url='https://animechan.vercel.app/api/random'

const resolvers = {
    Query: {
      allAnime: (root, args) => {
  
        let retorno=axios(url)
            .then((result) => {
  
              return result.data.results
  
            })
            .catch((error) => {
             return []
            });
  
        return retorno
  
      },
      findAnime: (root, args) => {
  
        let retorno=axios.get(url+"/"+args.id)
            .then((result) => {
  
              return result.data
  
            })
            .catch((error) => {
              return []
            });
  
        return retorno
  
      },
      AnimeCount: () => {
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
      addAnime: (root, args) => {
  
        const anime = { ...args, id: uuid() }
        animes = animes.concat(anime)
        return anime
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
  
