const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios').default;

let Vehicle=[]

const typeDefs = gql` 
  type Marcas {
    nome: String!
    codigo: String!
  }
  type Valor {
    Valor: String!
    Marca: String!
    Modelo: String!
    AnoModelo: Int!
    Combustivel: String!
    CodigoFipe: String!
    MesReferencia: String!
    TipoVeiculo: Int!
    SiglaCombustivel: String!
  }
  type Mutation {
    "Agrega un nuevo Vehicle"
    addValor(
      Valor: String!
      Marca: String!
      Modelo: String!
      AnoModelo: Int!
      Combustivel: String!
      CodigoFipe: String!
      MesReferencia: String!
      TipoVeiculo: Int!
      SiglaCombustivel: String!
    ): Valor    
  }
  type Query {
   "Agrega un nuevo Valor o Marcas"
    allMarcas(nome: String, codigo: String): [Marcas!]!
    allValor(Valor: String, Modelo: String): [Valor!]!
    marcasCount: Int!
    valorCount: Int!
  }
`

let Url1="https://parallelum.com.br/fipe/api/v1/carros/marcas"
let Url2="https://parallelum.com.br/fipe/api/v1/carros/marcas/59/modelos/5940/anos/2014-3"

const resolvers = {
  Query: {
    allMarcas: (root, args) => {
        if (!args.nome && !args.codigo) {
          const {data: { marcas } }=  await axios.get(apiUrl1)
          return marcas
        }
      },
    allValor: async ( root, args ) => {
        if (!args.Valor && !args.Modelo) {
          const { data:{ valor } } =  await axios.get(apiUrl2)
          return valor
        }
      },
    marcasCount: async () => {
          const { data:{ marcas } } =  await axios.get(apiUrl1)
          return marcas.length
    },
    valorCount: async () => {
          const { data:{ valor } } =  await axios.get(apiUrl2)
          return valor.length
    }
  },
  Mutation: {
    addValor: (root, args) => {

      const newValor = { ...args, id: uuid() }
      Vehicle = Vehicle.concat(newValor)
      return newValor
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
