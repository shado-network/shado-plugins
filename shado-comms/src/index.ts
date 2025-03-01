import { v4 as uuidv4 } from 'uuid'

import Fastify from 'fastify'
import cors from '@fastify/cors'
import type { FastifyInstance } from 'fastify'

import WebSocket, { WebSocketServer } from 'ws'

import { broadcast } from './libs/utils.websocket.js'

import type { HttpResponse, WebSocketResponse } from './types/comms.js'

class ShadoComms {
  static metadata = {
    identifier: 'shado-comms',
    description: 'First party intra-communication utility.',
    //
    key: 'comms',
  }

  config = {}

  //

  http: {
    server: undefined | FastifyInstance
    config: any
    secrets: any
  } = {
    server: undefined,
    config: {},
    secrets: {},
  }

  ws: {
    server: undefined | WebSocketServer
    config: any
    secrets: any
    connections: { [key: string]: WebSocket }
  } = {
    server: undefined,
    config: {},
    secrets: {},
    connections: {},
  }

  //

  _origin: any // | ShadoPuppet | ShadoPlay
  _context: any // | PuppetContext | PlayContext

  //

  constructor(
    config: {
      http: {
        port: number
      }
      ws: {
        port: number
      }
    },
    // secrets: any,
    _origin: any, // | ShadoPuppet | ShadoPlay,
    _context: any, // | PuppetContext | PlayContext,
  ) {
    this._context = _context
    this._origin = _origin

    // console.log('!!!', this._origin)

    // NOTE: HTTP Server
    this.http.config = {
      ...this.http.config,
      ...config.http,
    }

    this.http.secrets = {
      ...this.http.secrets,
      // ...secrets.http,
    }

    try {
      this.http.server = Fastify({
        // logger: true,
      })

      this.http.server?.register(cors, {
        allowedHeaders: '*',
      })
    } catch (error) {
      this._context.utils.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PLUGIN',
          id: this._origin.id,
        },
        data: {
          message: 'Could not create Shadō Comms http server',
        },
      })
    }

    // NOTE: WebSocket Server
    this.ws.config = {
      ...this.ws.config,
      ...config.ws,
    }

    this.ws.secrets = {
      ...this.ws.secrets,
      // ...secrets.ws,
    }

    try {
      this.ws.server = new WebSocketServer({
        port: this.ws.config.port,
      })

      this._context.utils.logger.send({
        type: 'SUCCESS',
        origin: {
          type: 'PLUGIN',
          id: this._origin.id,
        },
        data: {
          message: `Started Shadō Comms websocket server at port ${this.ws.config.port}`,
        },
      })
    } catch (error) {
      this._context.utils.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PLUGIN',
          id: this._origin.id,
        },
        data: {
          message: 'Could not create Shadō Comms websocket server',
        },
      })
    }

    this._initHttpServer()
    this._initWebSocketServer()
  }

  _initHttpServer = async () => {
    this._addHttpRoutes()
    this._addWebSocketEvents()

    try {
      await this.http.server?.listen({
        port: this.http.config.port,
      })

      this._context.utils.logger.send({
        type: 'SUCCESS',
        origin: {
          type: 'PLUGIN',
          id: this._origin.id,
        },
        data: {
          message: `Started Shadō Comms http server at port ${this.http.config.port}`,
        },
      })
    } catch (error) {
      this._context.utils.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PLUGIN',
          id: this._origin.id,
        },
        data: {
          message: 'Could not start Shadō Comms http server',
        },
      })

      // this.http.server?.log.error(error)
      // process.exit(1)
    }
  }

  //

  _defaultRouteError = (error: any) => {
    return {
      status: 'error',
      timestamp: Date.now(),
      data: {
        message: 'Something went wrong',
        error: error,
      },
    } satisfies HttpResponse
  }

  _addHttpRoutes = () => {
    // NOTE: Root
    this.http.server?.get('/', async (request, reply) => {
      return {}
    })

    // NOTE: Health check
    this.http.server?.get('/ping', async (request, reply) => {
      try {
        return {
          status: 'success',
          timestamp: Date.now(),
          data: {
            message: 'PONG',
          },
        } satisfies HttpResponse
      } catch (error) {
        return this._defaultRouteError(error)
      }
    })

    // NOTE: Puppet data
    this.http.server?.get('/puppet', async (request, reply) => {
      try {
        return {
          status: 'success',
          timestamp: Date.now(),
          data: {
            message: `Puppet data for [ ${this._origin.id} / ${this._origin.name} ]`,
            puppet: {
              id: this._origin.id,
              name: this._origin.name,
              image: undefined,
              port: this.http.config.httPort,
            },
          },
        } satisfies HttpResponse
      } catch (error) {
        return this._defaultRouteError(error)
      }
    })

    // NOTE: Play data
    this.http.server?.get('/play', async (request, reply) => {
      try {
        return {
          status: 'success',
          timestamp: Date.now(),
          data: {
            message: `Play data for [ ${this._origin.id} / ${this._origin.name} ]`,
            play: {
              id: this._origin.id,
              name: this._origin.name,
              image: undefined,
              port: this.http.config.httPort,
            },
          },
        } satisfies HttpResponse
      } catch (error) {
        return this._defaultRouteError(error)
      }
    })
  }

  //

  _initWebSocketServer = async () => {
    try {
      this.ws.server?.on('connection', (connection) => {
        const connectionId = uuidv4()
        this.ws.connections[connectionId] = connection
      })
    } catch (error) {
      // console.log(error)
    }
  }

  _addWebSocketEvents = () => {
    // NOTE: From puppet planner plugin.
    this._origin.events.on('planner', (payload: WebSocketResponse) => {
      // console.log('!!!', payload)
      broadcast(this.ws.connections, JSON.stringify(payload), false)
    })
  }
}

export default ShadoComms
