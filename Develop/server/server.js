const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  introspection: true,
  playground: true,
});

// Apply middleware to express server
server.applyMiddleware({ app });

// Use middleware for parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets for production environment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Serve the client-side app for GET requests to the root path
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Start the server and connect to the database
const startServer = async () => {
  await db.once('open', () => {
    console.log(`Connected to database.`);
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
    console.log(`GraphQL server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

// Call the async function to start the server
startServer();
