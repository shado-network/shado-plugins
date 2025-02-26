import TelegramClient from '@shado-network/client-telegram'
import { fmt, code } from '@shado-network/client-telegram'
// import type { AppContext } from '@core/context/types'
// import type { PuppetInstance } from '@core/puppet/types'
// import type { AbstractLogger } from '@core/abstract/types'
import type { SandboxConfig, SandboxMessage } from '../types/sandbox'

export class SandboxTelegramClient {
  config: SandboxConfig = {}
  secrets: {
    botHandle: string
    botToken: string
    chatId: string
  }

  client: any

  _context: any

  constructor(
    config: SandboxConfig,
    secrets: {
      botHandle: string
      botToken: string
      chatId: string
    },
    _context: any,
  ) {
    this._context = _context
    this.config = { ...this.config, ...config }
    this.secrets = { ...secrets }

    this._init()
  }

  _init = async () => {
    try {
      // TODO: Make this cleaner.
      const sandboxPuppet = {
        id: 'sandbox',
        name: 'Shadō Puppet Sandbox',
        //
        bio: undefined,
      }

      const sandboxContext = {
        logger: undefined,
        sandbox: this,
      }

      // NOTE: Telegram sandbox client.
      this.client = new TelegramClient(
        this.config,
        this.secrets,
        sandboxPuppet,
        sandboxContext,
      )
    } catch (error) {
      this._context.logger.send({
        type: 'ERROR',
        origin: {
          type: 'SERVER',
        },
        data: {
          message: 'Could not start Telegram sandbox client',
          payload: { error },
        },
      })
    }
  }

  _composeTelegramMessage = async (sandboxMessage: SandboxMessage) => {
    // NOTE: Styling.
    // TODO: Make same stylistic choices as the console logger.

    // NOTE: Logging.
    // TODO: Check if there is a payload.
    const message = fmt`
  [ PUPPET / ${sandboxMessage.origin.id?.toUpperCase()} ]
  ${sandboxMessage.data.message}
  
  PAYLOAD: 
  ${code`${JSON.stringify(sandboxMessage.data.payload || null, null, 2)}`}
  `

    await this.client.sendMessage(message, this.secrets.chatId)
  }

  send = async (sandboxMessage: SandboxMessage) => {
    // TODO: Split into compose and send.
    await this._composeTelegramMessage(sandboxMessage)
  }
}
