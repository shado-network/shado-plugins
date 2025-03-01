import { SandboxTelegramClient } from './libs/telegram.js'
import type { SandboxConfig, SandboxMessage } from './types/sandbox'
// import type { any, AbstractPlugin } from '@core/abstract/types'

class ShadoSandboxPlugin {
  static metadata = {
    identifier: 'shado-sandbox',
    description: "Shadō Network's sandbox environment utility.",
    //
    key: 'sandbox',
  }

  config: SandboxConfig = {}
  secrets: {
    botHandle: string
    botToken: string
    chatId: string
  }

  clients: any[] = []
  _context: any // | PuppetContext

  constructor(
    clientIdentifiers: string[],
    secrets: {
      botHandle: string
      botToken: string
      chatId: string
    },
    _context: any, // | PuppetContext,
  ) {
    this.secrets = { ...secrets }
    this._context = _context

    this._setClients(clientIdentifiers)

    this._context.utils.logger.send({
      type: 'SUCCESS',
      origin: {
        type: 'PLUGIN',
      },
      data: {
        message: 'Started Shadō Sandbox',
      },
    })
  }

  _setClients = (clientIdentifiers: string[]) => {
    clientIdentifiers.forEach((clientIdentifier: string) => {
      switch (clientIdentifier) {
        case 'shado-screen':
          break
        case 'logger':
          this.clients.push(this._context.utils.logger)
          break
        case 'telegram':
          this.clients.push(
            new SandboxTelegramClient(this.config, this.secrets, this._context),
          )
          break
      }
    })
  }

  send = (sandboxMessage: SandboxMessage) => {
    this.clients.forEach((client) => {
      client.send(sandboxMessage)
    })
  }
}

export default ShadoSandboxPlugin
