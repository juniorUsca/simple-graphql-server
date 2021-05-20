//Diego Edmilson Pamo Castro
//diego.pamo@tecsup.edu.pe

const { ApolloServer, gql } = require('apollo-server')
const { v4: uuid } = require('uuid')
const axios = require('axios')


let url="https://breakingbadapi.com/api/deaths"
let dios=[]

const typeDefs = gql` 

  type Death {
    death_id: String!    
    death: String!
    cause: String!
    responsible: String!
    last_words: String!
    season: Int!    
    episode: Int! 
    number_of_deaths: Int!  
  } 
  type Mutation {
    addDeath(
      death_id: Int!    
      death: String!
      cause: String!       
      responsible: String!
      last_words: String!  
      season: Int!  
      episode: Int!  
      number_of_deaths: Int!        
    ): Death  
  }
  type Query {
    getAllDeaths: [Death!]!
    getDeath(death_id: Int): Death!
    getS1Deaths: [Death!]!
    getS2Deaths: [Death!]!
    getS3Deaths: [Death!]!
    getS4Deaths: [Death!]!
    getS5Deaths: [Death!]!
    getPersonajeRespMostDeaths: Death!
    totalDeaths: Int!
  }
`

const resolvers = {
  Query: {
    //Ver todas las muertes de Breaking Bad
    getAllDeaths: () => {
      let rpta=axios(url).then((res) => {return res.data}).catch((error) => {
           return []
      });
      return rpta
    },

    //Buscar muerte
    getDeath: (_, args) => {
      let rpta=axios(url).then((res) => {
        const persona = res.data.find((ol) => ol.death_id == args.death_id)
          return persona
      }).catch((error) => {
            return []
        });
      return rpta
    },

    //Muertes de la season 1 Breaking Bad
    getS1Deaths: () => {
      let rpta=axios(url).then((res) => {
          const s1death  = res.data.filter((s1) => s1.season =="1")
        return s1death
      }).catch((error) => {
           return 0
      });
      return rpta
    },

    //Muertes de la season 2 Breaking Bad
    getS2Deaths: () => {
      let rpta=axios(url).then((res) => {
          const s2death  = res.data.filter((s2) => s2.season =="2")
        return s2death
      }).catch((error) => {
           return 0
      });
      return rpta
    },
    //Muertes de la season 3 Breaking Bad
    getS3Deaths: () => {
      let rpta=axios(url).then((res) => {
          const s3death  = res.data.filter((s3) => s3.season =="3")
        return s3death
      }).catch((error) => {
           return 0
      });
      return rpta
    },

    //Muertes de la season 4 Breaking Bad
    getS4Deaths: () => {
      let rpta=axios(url).then((res) => {
          const s4death  = res.data.filter((s4) => s4.season =="4")
        return s4death
      }).catch((error) => {
           return 0
      });
      return rpta
    },

    //Muertes de la season 5 Breaking Bad
    getS5Deaths: () => {
      let rpta=axios(url).then((res) => {
          const s5death  = res.data.filter((s5) => s5.season =="5")
        return s5death
      }).catch((error) => {
           return 0
      });
      return rpta
    },

    //Personaje Responsable de mas muertes
    getPersonajeRespMostDeaths: () => { 
      let rpta=axios(url).then((res) => {
      const md = res.data.reduce((acumulador, valoractual) => {
          if(!acumulador[valoractual.responsible]){
            acumulador[valoractual.responsible] = 1;
          }else{
            acumulador[valoractual.responsible]++;
          }
        return acumulador;
      })
        return md
            }).catch((error) => {
              return 0
            })
      return rpta
    },

    //Numero de registros totales
    totalDeaths: () => {
        let rpta=axios(url).then((res) => {
            const tamaño_api = res.data.length;
          return tamaño_api
        }).catch((error) => {
          return 0
        });
      return rpta
      },
    
  },
  Mutation: {
    addDeath: (_ , args) => {
      const brkb = {...args}
      dios = dios.concat(brkb)
      return brkb
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
