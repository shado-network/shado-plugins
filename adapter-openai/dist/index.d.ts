import { ChatOpenAIFields, ChatOpenAI } from '@langchain/openai';
import { BaseLanguageModelInput } from '@langchain/core/language_models/base';

declare class OpenAiAdapter {
    static metadata: {
        identifier: string;
        description: string;
        key: string;
    };
    config: ChatOpenAIFields;
    adapter: ChatOpenAI;
    _memoryClient: any;
    _puppet: any;
    _context: any;
    constructor(config: {}, secrets: {
        apiKey: string;
    }, _puppet: any, _context: any);
    getMessagesResponse: (messages: BaseLanguageModelInput, props: any) => Promise<any>;
}

export { OpenAiAdapter as default };
