const { Prisma } = require('prisma-binding');

const db = new Prisma({
  typeDefs: 'schema.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: 'super-secret'
});

module.exports = db;
