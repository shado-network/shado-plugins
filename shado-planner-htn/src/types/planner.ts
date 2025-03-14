// import type { AppContext } from '@core/context/types'
// import type { PuppetInstance } from '@core/puppet/types'

export type HtnGoal = {
  identifier: string
  description: string
  //
  evaluator: (props: GoalProps) => boolean
}

export type HtnTask = {
  identifier: string
  description: string
  //
  conditions: {
    [key: string]: (props: ValueProps) => boolean
    // [key: string]: Promise<{ success: boolean; payload: any }>
  }
  effects: {
    [key: string]: {
      value: (props: ValueProps) => boolean
      trigger: (
        props: TriggerProps,
      ) => Promise<{ success: boolean; payload: any }>
    }
  }
  actions: {
    [key: string]: (
      props: TriggerProps,
    ) => Promise<{ success: boolean; payload: any }>
  }
}

export type GoalProps = {
  _origin: any // | ShadoPuppet | ShadoPlay
  _context: any // | PuppetContext | PlayContext
  // [key: string]: any
}

export type ValueProps = {
  _origin: any // | ShadoPuppet | ShadoPlay
  _context: any // | PuppetContext | PlayContext
  // [key: string]: any
}

export type TriggerProps = {
  _origin: any // | ShadoPuppet | ShadoPlay
  _context: any // | PuppetContext | PlayContext
  // [key: string]: any
}
