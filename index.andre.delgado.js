const { ApolloServer, gql } = require('apollo-server')
// const { v4: uuid } = require('uuid')
const fetch = require('node-fetch')
const axios = require('axios');

let restaurantes = []



const getRestaurantes = async() => {
  await axios.get('https://www.tecfood.club/74054946816/api/Restaurante')
  .then(function async(response) {response.map((rest) => {
      let Restaurante = {
        nombre_rest : rest.nombre_rest,
        ubicacion : rest.ubicacion,
        descripcion : rest.descripcion
      }
      restaurantes = restaurantes.concat(Restaurante)
    })
  })
}

getRestaurantes()


const typeDefs = gql`

type Query {
  usuarios: [usuario!]!
  usuario(_id: ID!): usuario
  restaurantes: [restaurante!]!
  restaurante(_id: ID!): restaurante
}

type Mutation {
  "Agregar Restaurante"
  agregarRestaurante(
    nombre_rest: String!
    ubicacion: String!
    descripcion: String!
  ): restaurante
}
type usuario {
  id: ID!
  username: String!
  first_name: String!
  last_name: String!
  email: String!
  is_staff: String!
  date_joined: String!
}
type restaurante {
  id: ID!
  nombre_rest: String!
  ubicacion: String!
  descripcion: String!
}


`

const baseURL = `https://www.tecfood.club/74054946816/api`

const resolvers = {
  Query: {
    usuarios: () => {
      return fetch(`${baseURL}/Usuario`).then(res => res.json())
    },
    usuario: (parent, args) => {
      const { _id } = args
      return fetch(`${baseURL}/Usuario/${_id}`).then(res => res.json())
    },
    restaurantes: () => {
      return fetch(`${baseURL}/Restaurante`).then(res => res.json())
    },
    restaurante: (parent, args) => {
      const { _id } = args
      return fetch(`${baseURL}/Restaurante/${_id}`).then(res => res.json())
    },
  },
  Mutation: {
    agregarRestaurante: (root, args) => {
      const nuevoRestaurante = {
        nombre_rest: args.nombre_rest,
        ubicacion: args.ubicacion,
        descripcion: args.descripcion
      }
      restaurantes.push(nuevoRestaurante)

      return nuevoRestaurante
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

