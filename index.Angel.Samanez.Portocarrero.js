const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios').default;

let animes=[]

const typeDefs = gql` 
  type anime {
    anime: String!    
    character: String!
    quote: String!  
  }
  type Mutation {
    "Agrega un nuevo Anime"
    addAnime(
        anime: String!    
        character: String!
        quote: String!  
    ): anime    
  }
  type Query {
   "Agrega un nuevo Anime"
    allAnime(anime: String, character: String, quote: String): [Anime!]!
    animesCount: Int!
  }
`

let url='https://animechan.vercel.app/api/quotes'

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
