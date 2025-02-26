import { AnthropicInput, ChatAnthropic } from '@langchain/anthropic';
import { BaseChatModelParams } from '@langchain/core/language_models/chat_models';
import { BaseLanguageModelInput } from '@langchain/core/language_models/base';

declare class AnthropicAdapter {
    static metadata: {
        identifier: string;
        description: string;
        key: string;
    };
    config: AnthropicInput & BaseChatModelParams;
    adapter: ChatAnthropic;
    _memoryClient: any;
    _puppet: any;
    _context: any;
    constructor(config: {}, secrets: {
        apiKey: string;
    }, _puppet: any, _context: any);
    getMessagesResponse: (messages: BaseLanguageModelInput, props: any) => Promise<any>;
}

export { AnthropicAdapter as default };
