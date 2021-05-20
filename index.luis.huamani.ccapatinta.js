const { ApolloServer, gql } = require('apollo-server')
const { default: axios } = require('axios')
const { v4: uuid } = require('uuid')
  
  let animes  = []
  
  const typeDefs = gql` 

  type anime {
    anime: String!    
    character: String!
    quote: String!
  }
  type waifu {
    url: String!
  }
  type Mutation{
    "Buscar waifu"
    findWaifu(
      url: String!
    )
  }
  type Mutation {
    "Agregar un nuevo Anime"
    addAnime(
      anime: String!    
      character: String!
      quote: String!
    ): anime    
  }
  type Query {
   "Agregar un nuevo Anime"
    allAnime(anime: String, character: String, quote: String): [Anime!]!
    findAnime(anime: String): Anime!
    AnimeCount: Int!
  }
`

const url = 'https://animechan.vercel.app/api/quotes'
const waifusurl = 'https://api.waifu.pics/sfw/waifu'

const resolvers = {
  Query: {
    findWaifu:(root, args) => {
      let retorno=axios(waifusurl)
          .then((result) => {

            return result.data.results

          })
          .catch((error) => {
           return []
          });
      return retorno
    },
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
