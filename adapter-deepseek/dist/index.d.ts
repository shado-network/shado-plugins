import { ChatOpenAIFields, ChatOpenAI } from '@langchain/openai';
import { BaseLanguageModelInput } from '@langchain/core/language_models/base';

declare class DeepSeekAdapter {
    static metadata: {
        identifier: string;
        description: string;
        key: string;
    };
    config: ChatOpenAIFields & {
        baseURL: string;
    };
    adapter: ChatOpenAI;
    _memoryClient: any;
    _puppet: any;
    _context: any;
    constructor(config: {}, secrets: {
        apiKey: string;
    }, _puppet: any, // | ShadoPuppet,
    _context: any);
    getMessagesResponse: (messages: BaseLanguageModelInput, props: any) => Promise<any>;
}

export { DeepSeekAdapter as default };
