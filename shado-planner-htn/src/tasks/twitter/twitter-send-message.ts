import { HumanMessage, SystemMessage } from '@langchain/core/messages'

import { MIN_IN_MSEC } from '../../libs/constants.js'
import type { HtnTask } from '../../types/planner.js'

export default {
  identifier: 'twitter-send-message',
  description: 'Post a message to Twitter.',

  conditions: {
    'twitter-has-client': (props) =>
      props._origin.memory.state?.['twitter-has-client'] === true,
    'twitter-has-logged-in': (props) =>
      props._origin.memory.state?.['twitter-has-logged-in'] === true,
    'twitter-last-sent': (props) =>
      props._origin.memory.state?.['twitter-last-sent'] <=
      Date.now() - 3 * MIN_IN_MSEC,
  },

  effects: {
    'twitter-last-sent': {
      // value: (props) => false,
      value: (props) =>
        props._origin.memory.state?.['twitter-last-sent'] <=
        Date.now() - 3 * MIN_IN_MSEC,
      trigger: async (props) => {
        props._origin.memory.state['twitter-last-sent'] = Date.now()

        return {
          success: true,
          payload: undefined,
        }
      },
    },
  },

  actions: {
    'twitter-send-message': async (props) => {
      try {
        let messages = []
        let firstMessageInThread = false

        // TODO: Temp fix!
        const message = {
          from_id: 'SELF',
          // TODO: Do something else...
          message: 'What are you thinking about today?',
        }

        // NOTE: Write response.

        // NOTE: Check if this is a new thread.
        if (
          !props._origin.clients['twitter']
            .getMessageThreads()
            .includes(`twitter-${message.from_id}`)
        ) {
          props._origin.clients['twitter'].addMessageThread(
            `twitter-${message.from_id}`,
          )

          firstMessageInThread = true
        }

        if (firstMessageInThread) {
          messages = [
            new SystemMessage(props._origin.config.bio.join('\n')),
            new HumanMessage(message.message),
          ]
        } else {
          // TODO: Do something else...
          message.message = 'Could you elaborate?'
          messages = [new HumanMessage(message.message)]
        }

        // console.log('!!!', messages, `twitter-${message.from_id}`)

        // NOTE: Generate a response.
        const response = await (props._origin.model as any).getMessagesResponse(
          messages,
          {
            thread: `twitter-${message.from_id}`,
          },
        )

        // console.log('???', props._origin.clients['twitter'].sendMessage)

        // NOTE: Send the message.
        await props._origin.clients['twitter'].sendMessage(response as string)

        // props._origin.clients['twitter'].markAsRead(message.id)

        return {
          success: true,
          payload: response,
        }
      } catch (error) {
        return {
          success: false,
          payload: error,
        }
      }
    },
  },
} satisfies HtnTask
