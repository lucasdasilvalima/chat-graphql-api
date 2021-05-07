import startServer from "./startServer";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import startApolloServer from "./startServerHTTPS";

startApolloServer({ typeDefs, resolvers });