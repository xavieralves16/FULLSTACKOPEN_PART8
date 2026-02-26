import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import http from 'http'
import mongoose from 'mongoose'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

import typeDefs from './schema.js'
import resolvers from './resolvers.js'

const startServer = async () => {
  const app = express()
  const httpServer = http.createServer(app)


  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')


  const schema = makeExecutableSchema({ typeDefs, resolvers })


  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const serverCleanup = useServer({ schema }, wsServer)


  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server)
  )

  const PORT = process.env.PORT || 4000
  httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
  })
}

startServer()