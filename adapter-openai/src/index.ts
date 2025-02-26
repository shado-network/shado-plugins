import { ChatOpenAI } from '@langchain/openai'
import type { ChatOpenAIFields } from '@langchain/openai'
import type { BaseLanguageModelInput } from '@langchain/core/language_models/base'

// import type { AppContext } from '@core/context/types'
// import type { AbstractPlugin } from '@core/abstract/types'

class OpenAiAdapter {
  static metadata = {
    identifier: 'adapter-openai',
    description: 'Wrapper for OpenAI interaction through LangChain.',
    key: 'model',
  }

  config: ChatOpenAIFields = {
    model: 'gpt-4o-mini',
    temperature: 1.0,
    maxTokens: 256,
    // apiKey,
  }

  adapter: ChatOpenAI
  _memoryClient

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

export default OpenAiAdapter
