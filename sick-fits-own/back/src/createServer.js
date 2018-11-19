const { GraphQLServer } = require('graphql-yoga');
const db = require('./db');
const Query = require('./query');
const Mutation = require('./mutation');

function createServer() {
  const server = new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Query,
      Mutation
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({ ...req, db })
  });
  return server;
}

module.exports = createServer;
