const {ApolloServer, gql} = require('apollo-server');
const {v4: uuid} = require('uuid');
const axios = require('axios').default;

let people = [];

const typeDefs = gql`
	type People {
		id: String!
		name: String!
		gender: String!
		age: String!
		eye_color: String!
		hair_color: String!
		species: String!
		url: String!
		films: [String!]!
	}

	type Mutation {
		addPeople(id: String!, name: String!, gender: String!, age: String!): People
	}

	type Query {
		getAllPeople: [People!]!
		getAPerson(id: String): People!
		getMalePeople: [People!]!
	}
`;

let url = 'https://ghibliapi.herokuapp.com/people/';

const resolvers = {
	Query: {
		getAllPeople: (root, args) => {
			let resultado = axios(url)
				.then(result => {
					return result.data;
				})
				.catch(error => {
					return [ 'NO SE ENCONTRO NINGUN ELEMENTO' ];
				});
			return resultado;
		},
		getAPerson: (root, args) => {
			let retorno = axios
				.get(url + '/' + args.id)
				.then(result => {
					return result.data;
				})
				.catch(error => {
					return [];
				});

			return retorno;
		},
		getMalePeople: () => {
			let resultado = axios(url)
				.then(result => {
					return result.data.filter(persons => persons.gender == 'Male');
				})
				.catch(error => {
					return [ 'NO SE ENCONTRO NINGUN HOMBRE' ];
				});
			return resultado;
		}
	},
	Mutation: {
		addPeople: (root, args) => {
			const persona = {
				...args
			};
			people = people.concat(persona);
			console.log(people);
			return persona;
		}
	}
};

const server = new ApolloServer({
	typeDefs,
	resolvers
});

server.listen().then(({url}) => {
	console.log(`Server ready at ${url}`);
});
