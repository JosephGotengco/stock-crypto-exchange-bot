import express from "express";
import { importSchema } from "graphql-import";
import { ApolloServer } from "apollo-server-express";
const typeDefs = importSchema("./src/typeDefs.gql");
import { resolvers } from "./src/resolvers";

// constants
const PORT = 4000 || process.env.PORT;

const server = new ApolloServer({
    typeDefs: [typeDefs],
    resolvers,
    introspection: true,
    playground: true,
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: PORT }, () => {
    console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
});
