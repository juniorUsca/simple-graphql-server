const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios')

let films=[]

const typeDefs = gql` 

type Query {
   getAllFilms: [Film!]!
   getFilm(id: String): Film!
   get2013Films: [Film!]!
   getBestRateFilm: Film!
   totalFilm: Int!
 }

  type Film {
    id: String!    
    title: String!
    original_title: String!
    original_title_romanised: String!
    description: String!
    director: String!    
    producer: String! 
    release_date: String! 
    running_time: String!
    rt_score: String! 
    people: [String!]!   
    species: [String!]!   
  } 

  type Mutation {
    addFilm(
      id: String!    
      title: String!
      director: String!       
      release_date: String!      
    ): Film  
  }
`

let api="https://ghibliapi.herokuapp.com/films/"

const resolvers = {
  Query: {

    //Query retornar todos los  Films
    getAllFilms: (root, args) => {
      let res=axios(api).then((result) => {
          return result.data
      }).catch((error) => {
           return ["No hay elementos"]
      });
      return res
    },

    //Query retornar solo un Film según el id
    getFilm: (root, args) => {
      let res=axios.get(api+args.id).then((result) => {
          return result.data
        }).catch((error) => {
            return []
        });
      return res

    },
    //Query  retornar solo los films que se hayan estrenado en 2013
    get2013Films: () => {
      let res=axios(api).then((result) => {
          var f2013  = result.data.filter((film) => film.release_date =="2013");
          console.log(f2013)
        return f2013
      }).catch((error) => {
           return 0
      });
      return res
    },
    //Query retorna el fiml con mejor puntuación
    getBestRateFilm: () => { 
      let res=axios(api).then((result) => {
      const max = result.data.reduce(function(prev, current) {
        return (prev.rt_score > current.rt_score) ? prev : current
      })
      console.log(max)
       return max
          }).catch((error) => {
           return 0
          });
      return res
    },
    //Query retornar la cantidad de Films
      totalFilm: () => {
        let res=axios(api).then((result) => {
        var total = []
        for(var i = 0; i < result.data.length; i++) {
                total.push(result.data[i].id);
        }
        console.log(total.length)
        return total.length
        }).catch((error) => {
          return 0
        });
    return res
      },
  },
  Mutation: {
    addFilm: (root, args) => {
      const film = {
         ...args
      }
      films = films.concat(film)
      return film
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