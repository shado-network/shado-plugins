import { NodeConsoleClient } from './libs/node-console.js'

import type { LoggerClient, LoggerConfig, LoggerMessage } from './types/logger'
import type { AbstractLoggerClient } from './types/abstract'

class ShadoLogger {
  static metadata = {
    identifier: 'shado-logger',
    description: "Shadō Network's logging utility.",
    //
    key: 'logger',
  }

  config: LoggerConfig = {
    showIcon: false,
    showUser: false,
  }

  clients: AbstractLoggerClient[] = []

  constructor(
    clientIdentifiers: LoggerClient[],
    config: Partial<LoggerConfig> = {},
  ) {
    this.config = { ...this.config, ...config }
    this._initClients(clientIdentifiers)

    this.send({
      type: 'SUCCESS',
      origin: {
        type: 'PLUGIN',
      },
      data: {
        message: 'Started Shadō Logger',
      },
    })
  }

  _initClients = (clientIdentifiers: string[]) => {
    clientIdentifiers.forEach((clientIdentifier: string) => {
      switch (clientIdentifier) {
        case 'shado-screen':
          break
        case 'node-console':
          this.clients.push(new NodeConsoleClient(this.config))
          break
      }
    })
  }

  send = (loggerMessage: LoggerMessage) => {
    this.clients.forEach((client) => {
      client.send?.(loggerMessage)
    })
  }
}

export default ShadoLogger
