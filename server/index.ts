import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server, LobbyRoom } from 'colyseus'
import { monitor } from '@colyseus/monitor'
import { RoomType } from '../types/Rooms'

import { NeynarAPIClient, isApiErrorResponse } from '@neynar/nodejs-sdk'
import { config } from 'dotenv'
import path from 'path'

if (process.env.NODE_ENV !== 'production') {
  config({ path: path.resolve(__dirname, './.env.local') })
} else {
  // In production, environment variables should be set in the hosting platform
  console.log('Running in production mode')
}
// import socialRoutes from "@colyseus/social/express"

import { SkyOffice } from './rooms/SkyOffice'

const port = Number(process.env.PORT || 2567)
const app = express()

app.use(cors())
app.use(express.json())
// app.use(express.static('dist'))

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY

if (!NEYNAR_API_KEY) {
  console.error('NEYNAR_API_KEY is not defined in the environment variables')
  process.exit(1)
}
const client = new NeynarAPIClient(NEYNAR_API_KEY)
app.post('/api/cast', async (req, res) => {
  const { signerUuid, text } = req.body

  if (!signerUuid || !text) {
    return res.status(400).json({ message: 'Missing required parameters' })
  }

  try {
    console.log('Attempting to publish cast with:', { signerUuid, text })
    const { hash } = await client.publishCast(signerUuid, text)
    console.log('Cast published successfully with hash:', hash)
    res.status(200).json({ message: `Cast with hash ${hash} published successfully` })
  } catch (error) {
    console.error('Error publishing cast:', error)
    if (isApiErrorResponse(error)) {
      console.error('API Error:', error.response?.data)
      res.status(500).json({ message: 'Failed to publish cast', error: error.response?.data })
    } else {
      res.status(500).json({ message: 'Failed to publish cast', error: String(error) })
    }
  }
})

const server = http.createServer(app)
const gameServer = new Server({
  server,
})

// register room handlers
gameServer.define(RoomType.LOBBY, LobbyRoom)
gameServer.define(RoomType.PUBLIC, SkyOffice, {
  name: 'Public Lobby',
  description: 'For making friends and familiarizing yourself with the controls',
  password: null,
  autoDispose: false,
})
gameServer.define(RoomType.CUSTOM, SkyOffice).enableRealtimeListing()

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor())

gameServer.listen(port)
console.log(`Listening on ws://localhost:${port}`)
