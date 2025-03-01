import { ChatOpenAI } from '@langchain/openai'
import type { ChatOpenAIFields } from '@langchain/openai'
import type { BaseLanguageModelInput } from '@langchain/core/language_models/base'

// import type { AppContext } from '@core/context/types'
// import type { AbstractPlugin } from '@core/abstract/types'

class DeepSeekAdapter {
  static metadata = {
    identifier: 'adapter-deepseek',
    description: 'Wrapper for DeepSeek interaction through LangChain.',
    //
    key: 'model',
  }

  config: ChatOpenAIFields & { baseURL: string } = {
    model: 'deepseek-chat',
    temperature: 1.0,
    maxTokens: 256,
    baseURL: 'https://api.deepseek.com',
    // apiKey,
  }

  adapter: ChatOpenAI
  _memoryClient

  //

  _puppet: any // | ShadoPuppet
  _context: any // | PuppetContext

  constructor(
    config: {},
    secrets: {
      apiKey: string
    },
    _puppet: any, // | ShadoPuppet,
    _context: any, // | PuppetContext,
  ) {
    this._context = _context
    this._puppet = _puppet

    this.adapter = new ChatOpenAI({
      ...this.config,
      ...config,
      ...secrets,
    })

    this._memoryClient = this._puppet._memoryClient(this.adapter)
  }

  getMessagesResponse = async (
    messages: BaseLanguageModelInput,
    props: any,
  ) => {
    const response = await this._memoryClient.invoke(
      { messages },
      { configurable: { thread_id: props.thread } },
    )

    if (!response || !response.messages || response.messages.length === 0) {
      this._context.utils.logger.send({
        type: 'WARNING',
        origin: {
          type: 'SERVER',
        },
        data: {
          message: 'Error parsing response',
          payload: { content: response.content },
        },
      })
    }

    return response.messages[response.messages.length - 1].content
  }
}

export default DeepSeekAdapter
