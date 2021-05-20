const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios').default;

let libro=[]

const typeDefs = gql` 
  enum yes_no {
    yes
    no
  } 
  type Libro {
    id: String!    
    name: String!
    type: String!
    gender: String!    
    origin: [String!]!    
    image: String! 
    pagina: [String!]!    
  }
  type Mutation {
    "Agrega un nuevo libro"
    addLibro(
      id: Int!    
      name: String!
      type: String!
      gender: String!   
    ): Libro    
  }
  type Query {
   "Agrega un nuevo libro"
    allLibro(author: String, Editorial: String): [Libro!]!
    findLibro(id: String): Libro!
    libroCount: Int!
  }
`

let url="https://bhagavadgita.io/api/"

const resolvers = {
  Query: {
    allLibro: (root, args) => {

      let retorno=axios(url)
          .then((result) => {

            return result.data.results

          })
          .catch((error) => {
           return []
          });

      return retorno

    },
    findLibro: (root, args) => {

      let retorno=axios.get(url+"/"+args.id)
          .then((result) => {

            return result.data

          })
          .catch((error) => {
            return []
          });

      return retorno

    },
    LibroCount: () => {
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
    addLibro: (root, args) => {

      const librp = { ...args, id: uuid() }
      libros = libros.concat(Libro)
      return libro
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
