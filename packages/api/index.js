const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const GRAPHQL_PORT = process.env.PORT || 3000;
const app = express();

const queries = [];

app.use('/graphql', bodyParser.json(), (req, res, next) => {
  if (req.body.extensions && req.body.extensions.persistedQuery) {
    const id = req.body.extensions.persistedQuery.sha256Hash;

    if (queries.indexOf(id) === -1) {
      queries.push(id);
      res.json({ errors: [{ message: 'PersistedQueryNotFound' }] });
    } else {
      res.json({ data: { hello: 'world' } });
    }
  }
});

app.listen(GRAPHQL_PORT, () => {
  console.log('The app backend is now running');
});
