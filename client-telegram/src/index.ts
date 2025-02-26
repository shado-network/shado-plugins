import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { fmt, code } from 'telegraf/format'
import type { FmtString } from 'telegraf/format'

// import type { AppContext } from '@core/context/types'
// import type { PuppetInstance } from '@core/puppet/types'
// import type { AbstractPlugin } from '@core/abstract/types'
import type { TelegramMessage } from './types/telegram'

class TelegramClient {
  static metadata = {
    identifier: 'client-telegram',
    description: 'Basic Telegram client through Telegraf.',
    //
    key: 'telegram',
  }

  config: {} = {
    // SECONDS_PER_CHAR: 0.0125,
  }
  secrets: {
    botHandle?: string
    botToken?: string
    chatId?: string
  } = {}

  //

  client: undefined | Telegraf

  threads: string[] = []
  messages: TelegramMessage[] = []

  //

  _puppet: any
  _context: any

  constructor(
    config: {},
    secrets: {
      botHandle: string
      botToken: string
      chatId?: string
    },
    _puppet: any,
    _context: any,
  ) {
    this._context = _context
    this._puppet = _puppet

    this.config = {
      ...this.config,
      ...config,
    }

    this.secrets = {
      ...this.secrets,
      ...secrets,
    }

    try {
      this.client = new Telegraf(this.secrets.botToken || 'UNDEFINED')
    } catch (error) {
      this._context.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PUPPET',
          id: this._puppet.id,
        },
        data: {
          message: 'Could not connect to Telegram bot',
        },
      })
    }

    this._init()
  }

  _init = async () => {
    this.client?.on(message('text'), (ctx) => {
      this._storeMessage(ctx)
    })

    this.client?.launch()

    process.once('SIGINT', () => this.client?.stop('SIGINT'))
    process.once('SIGTERM', () => this.client?.stop('SIGTERM'))
  }

  _storeMessage = async (ctx: any) => {
    const message: TelegramMessage = {
      id: ctx.message.message_id,
      text: ctx.message.text,
      is_read: false,
      //
      from: {
        id: ctx.message.from.id,
        name: ctx.message.from.first_name,
      },
      metadata: {
        chat: { type: ctx.message.chat.type },
        replyFn: async (message: string) => {
          await ctx.reply(message, {
            reply_to_message_id: ctx.message.message_id,
          })
        },
      },
    }

    this.messages.push(message)

    return message
  }

  getMessageThreads = () => {
    return this.threads
  }

  addMessageThread = (threadIdentifier: string) => {
    this.threads.push(threadIdentifier)
  }

  getMessages = () => {
    return this.messages.filter((message) => !message.is_read)
  }

  clearReadMessages = () => {
    this.messages = this.messages.filter((message) => !message.is_read)
  }

  sendMessage = async (message: string | FmtString, chatId: string) => {
    const newCtx = await this.client?.telegram.sendMessage(chatId, message)
  }

  replyToMessage = async (
    message: string,
    replyFn: (message: string) => Promise<void>,
  ) => {
    const newCtx = await replyFn(message)
  }

  markAsRead = async (messageId: number) => {
    const message = this.messages.find((message) => message.id === messageId)

    if (!message) {
      return
    }

    message.is_read = true

    // TODO: Purge message?
  }
}

export default TelegramClient
export { fmt, code }
