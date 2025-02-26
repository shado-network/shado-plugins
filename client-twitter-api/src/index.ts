import { TwitterApi } from 'twitter-api-v2'
import type { IClientSettings, TwitterApiTokens } from 'twitter-api-v2'

// import type { AppContext } from '@core/context/types'
// import type { PuppetInstance } from '@core/puppet/types'
// import type { AbstractPlugin } from '@core/abstract/types'

class TwitterApiClient {
  static metadata = {
    identifier: 'client-twitter-api',
    description: 'Basic Twitter API client.',
    //
    key: 'twitter',
  }

  config: {} = {}
  secrets: {
    appKey?: string
    appSecret?: string
    accessToken?: string
    accessSecret?: string
  } = {}

  //

  client: undefined | TwitterApi

  threads: string[] = []
  messages: any[] = []

  //

  _context: any
  _puppet: any

  constructor(
    config: {},
    secrets: {
      appKey: string
      appSecret: string
      accessToken: string
      accessSecret: string
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

    this._context.logger.send({
      type: 'SUCCESS',
      origin: {
        type: 'PUPPET',
        id: this._puppet.id,
      },
      data: {
        message: `Loaded client plugin "client-twitter-api"`,
      },
    })
  }

  login = async () => {
    try {
      const credentials: TwitterApiTokens = {
        appKey: this.secrets.appKey || 'UNDEFINED',
        appSecret: this.secrets.appSecret || 'UNDEFINED',
        accessToken: this.secrets.accessToken || 'UNDEFINED',
        accessSecret: this.secrets.accessSecret || 'UNDEFINED',
      }

      const settings: Partial<IClientSettings> = {}

      this.client = new TwitterApi(credentials, settings)

      // const current = await this.client.currentUser()
      // console.log({ current })

      // this.client.login()

      // this._context.logger.send({
      //   type: 'SUCCESS',
      //   origin: {
      //     type: 'PUPPET',
      //     id: this._puppet.id,
      //   },
      //   data: {
      //     message: `Connected to Twitter bot`,
      //   },
      // })

      return true
    } catch (error) {
      this._context.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PUPPET',
          id: this._puppet.id,
        },
        data: {
          message: `Error connecting to Twitter bot`,
          payload: { error },
        },
      })

      return false
    }
  }

  getMessageThreads = () => {
    return this.threads
  }

  addMessageThread = (threadIdentifier: string) => {
    this.threads.push(threadIdentifier)
  }

  sendMessage = async (message: string) => {
    if (this._context.config.sandboxMode) {
      this._context.sandbox.send({
        type: 'SANDBOX',
        origin: {
          type: 'PUPPET',
          id: this._puppet.id,
        },
        data: {
          message: 'client-twitter-api | sendMessage()',
          payload: { message },
        },
      })

      return
    }

    const response = await this.client?.v2.tweet(message)
    // console.log('!!!', 'client-twitter | sendMessage()', { response })
  }
}

export default TwitterApiClient
