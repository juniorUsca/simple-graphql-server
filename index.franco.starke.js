const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios').default;

let Bible=[]

const typeDefs = gql` 
  enum yes_no {
    yes
    no
  } 
  type Bible {
    id: String!    
    name: String!
    type: String!   
    origin: [String!]!    
    image: String! 
    pagina: [String!]!    
  }
  type Mutation {
    "Agrega una nueva biblia"
    addLibro(
      id: Int!    
      name: String!
      type: String!
    ): Bible    
  }
  type Query {
   "Agrega una nueva Biblia"
    allBible(author: String, Editorial: String): [Bible!]!
    findBible(id: String): Bible!
    BibleCount: Int!
  }
`

let url="https://www.abiblidigital/verses/nvi/sl/30"

const resolvers = {
  Query: {
    allBible: (root, args) => {

      let retorno=axios(url)
          .then((result) => {

            return result.data.results

          })
          .catch((error) => {
           return []
          });

      return retorno

    },
    findBible: (root, args) => {

      let retorno=axios.get(url+"/"+args.id)
          .then((result) => {

            return result.data

          })
          .catch((error) => {
            return []
          });

      return retorno

    },
    BibleCount: () => {
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
    addBible: (root, args) => {

      const Bible = { ...args, id: uuid() }
      bibles = bibles.concat(Bible)
      return bible
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
