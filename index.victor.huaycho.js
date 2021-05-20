const { fetch } = require('apollo-env')
const axios = require('axios');
const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')

let animes = []

const Apiget = async() => {
  await axios.get('https://kitsu.io/api/edge/anime')
  .then(function async(response) {response.data.data.map((anime) => {
      let Anime = {
        id : anime.id,
        type : anime.type,
        name : anime.attributes.slug,
        createdAt: anime.attributes.createdAt,
        sinopsis : anime.attributes.synopsis,
        averageRating : anime.attributes.averageRating,
        startDate: anime.attributes.startDate,
        endDate: anime.attributes.endDate,
        ageRatingGuide : anime.attributes.ageRatingGuide,
        subtype : anime.attributes.subtype,
        status: anime.attributes.status,
        episodeCount : anime.attributes.episodeCount,
        nsfw : anime.attributes.nsfw,
      }
      animes = animes.concat(Anime)
    })
  })
}
Apiget()
     
const typeDefs = gql`
  type Anime {
    id : Int!
    type : String!
    name : String!
    createdAt : String!
    sinopsis : String!
    averageRating : String!
    startDate : String!
    endDate : String!
    ageRatingGuide : String!
    subtype : String!
    status : String!
    episodeCount : Int!
    nsfw : String!
  }
  type Mutation {
    "Agregar nuevo anime"
    addAnime(
      type : String!
      name : String!
      createdAt : String!
      sinopsis : String!
      averageRating : String!
      startDate : String!
      endDate : String!
      ageRatingGuide : String!
      subtype : String!
      status : String!
      episodeCount : Int!
      nsfw : String!
    ): Anime
  }
  type Query {
    allAnimes(type: String): [Anime!]!
    getAnimeById(id: Int!): Anime
    AnimesCount: Int!
  }
`
  
const resolvers = {
  Query: {
    allAnimes: (root, args) => {
      if (!args.type) {
        return animes
      }
      return animes.filter(anime => anime.type.includes(args.type))
    },
    getAnimeById: (root, args) => {
      return animes.find(anime => anime.id == args.id)
    },

    AnimesCount: () => animes.length,
  },
  Mutation: {
    addAnime: (root, args) => {
      const newAnime = {
        ...args, id: parseInt(animes[animes.length-1].id) +1
      }

      animes = animes.concat(newAnime)
      return newAnime
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


