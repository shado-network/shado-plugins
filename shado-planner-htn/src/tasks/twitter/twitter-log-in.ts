import { MIN_IN_MSEC } from '../../libs/constants.js'
import type { HtnTask } from '../../types/planner.js'

export default {
  identifier: 'twitter-log-in',
  description: 'Log in to Twitter.',

  conditions: {
    'twitter-has-client': (props) =>
      props._origin.memory.state?.['twitter-has-client'] === true,
    'twitter-has-logged-in': (props) =>
      props._origin.memory.state?.['twitter-has-logged-in'] === false,
    'twitter-last-log-in': (props) =>
      props._origin.memory.state?.['twitter-last-log-in-attempt'] <=
      Date.now() - 1 * MIN_IN_MSEC,
  },

  effects: {
    'twitter-has-logged-in': {
      value: (props) => true,
      trigger: async (props) => {
        props._origin.memory.state['twitter-has-logged-in'] = true

        return {
          success: true,
          payload: undefined,
        }
      },
    },
    'twitter-last-log-in-attempt': {
      value: (props) =>
        props._origin.memory.state?.['twitter-log-in-try'] <=
        Date.now() - 1 * MIN_IN_MSEC,
      trigger: async (props) => {
        props._origin.memory.state['twitter-last-log-in-attempt'] = Date.now()

        return {
          success: true,
          payload: undefined,
        }
      },
    },
  },

  actions: {
    'twitter-log-in': async (props) => {
      props._origin.memory.state['twitter-last-log-in-attempt'] = Date.now()

      try {
        const result = await props._origin.clients['twitter'].login()

        if (result === true) {
          return {
            success: true,
            payload: undefined,
          }
        } else {
          return {
            success: false,
            payload: undefined,
          }
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
