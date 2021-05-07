import express from 'express';
import { ApolloServer, PubSub } from 'apollo-server-express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import mongoose  from 'mongoose';

async function startApolloServer({ typeDefs, resolvers }) {
    const configurations = {
        // Note: You may need sudo to run on port 443
        production: { ssl: true, port: 4000, hostname: 'localhost' },
        development: { ssl: false, port: 4000, hostname: 'localhost' },
    };

    const environment = process.env.NODE_ENV || 'production';
    const config = configurations[environment];

    mongoose.connect("mongodb://localhost:27017/graphql", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    const pubsub = new PubSub();
    const server = new ApolloServer({ typeDefs, resolvers, context: {pubsub} });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });

    // Create the HTTPS or HTTP server, per configuration
    let httpServer;
    if (config.ssl) {
        // Assumes certificates are in a .ssl folder off of the package root.
        // Make sure these files are secured.
        httpServer = https.createServer(
            {
                key: fs.readFileSync(`./ssl/${environment}/privateKey.key`),
                cert: fs.readFileSync(`./ssl/${environment}/certificate.crt`)
            },
            app,
        );
    } else {
        httpServer = http.createServer(app);
    }

    await new Promise(resolve => httpServer.listen({ port: config.port }, resolve));
    console.log(
        '🚀 Server ready at',
        `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${server.graphqlPath}`
    );
    return { server, app };
}
export default startApolloServer