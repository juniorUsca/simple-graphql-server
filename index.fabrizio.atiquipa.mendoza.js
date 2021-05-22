const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios').default;

let movie = []

const typeDefs = gql`
  enum YES_NO {
    YES
    NO
  }
  type Movie {
    original_language: String!
    original_title: String!
    overview: String!
    popularity: Float!
    id: ID!
  }
  type Mutation {
    "Agrega un nuevo pelicula"
    addMovie(
      original_language: String!
      original_title: String!
      overview: String!
      popularity: Float!
      id: ID!
    ): Movie,
    deleteMovie(
      id: ID!
    ): Movie,
    updateMovie(
      id: ID, setTitleTo: String
    ): Movie

  }
  type Query {
    allMoviesLocal(original_title: String, overview: String): [Movie!]!
    allMovies(original_title: String, overview: String): [Movie!]!
    countMovies: Int!
    getLenguaje: [Movie!]!
  }
`
let url="https://api.themoviedb.org/3/movie/now_playing?api_key=aceb87b8a642477c0daa1cdcb2a2038f&language=es-ES&page=1"

const resolvers = {
  Query: {
    allMoviesLocal: (root, args) => {
      if (!args.original_title && !args.overview) {
        return movie
      }

      if (args.original_title)
      movie = movie.filter((movies) => movies.original_title === args.original_title)

      if (args.overview) {
        return movie.filter(
          (movie) => movie.overview.findIndex((overview) => overview == args.overview) !== -1
        )
      }
    },
    allMovies: (root, args) => {
      let retorno=axios(url)
          .then((result) => {

            return result.data.results

          })
          .catch((error) => {
           return []
          });

      return retorno

    },
    countMovies: async (root, args) => {
      let retorno= await axios(url)
      .then((result) => {

          return result.data.results

      })
      .catch((error) => {
          return []
      });

      return retorno.length

    },
    getLenguaje: () => {
			let resultado = axios(url)
				.then(result => {
					return result.data.results.filter(leng => leng.original_language == 'en');
				})
				.catch(error => {
					return [];
				});
			return resultado;
		}

  },
  Mutation: {
    addMovie: (root, args) => {
      const movies = { ...args, id: uuid() }
      movie = movie.concat(movies)
      return movies
    },
    deleteMovie: async (_,{id}) => {
      return await movie.pop(id)
    },
    updateMovie: async (root, args) => {
      const movies = movie.find((a) => a.id === args.id)
      if (!movies) {
        return null
      }
      const updatedMovie = { ...movies, original_title: args.setTitleTo}
      movie = movie.map((movies) =>
      movies.id === updatedMovie.id ? updatedMovie : movies
      )
      return updatedMovie
    }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})



