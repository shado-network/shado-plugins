import { ChatAnthropic } from '@langchain/anthropic'
import type { AnthropicInput } from '@langchain/anthropic'
import type { BaseChatModelParams } from '@langchain/core/language_models/chat_models'
import type { BaseLanguageModelInput } from '@langchain/core/language_models/base'

// import type { AppContext } from '@core/context/types'
// import type { AbstractPlugin } from '@core/abstract/types'

class AnthropicAdapter {
  static metadata = {
    identifier: 'adapter-anthropic',
    description: 'Wrapper for Anthropic Claude interaction through LangChain.',
    key: 'model',
  }

  config: AnthropicInput & BaseChatModelParams = {
    model: 'claude-3-5-sonnet-20241022',
    temperature: 1.0,
    maxTokens: 256,
    // apiKey,
  }

  adapter: ChatAnthropic
  _memoryClient: any

  //

  _puppet: any
  _context: any

  constructor(
    config: {},
    secrets: {
      apiKey: string
    },
    _puppet: any,
    _context: any,
  ) {
    this._context = _context
    this._puppet = _puppet

    this.adapter = new ChatAnthropic({
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
      this._context.logger.send({
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

export default AnthropicAdapter
