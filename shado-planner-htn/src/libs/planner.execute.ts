import { asyncForEach, asyncEvery } from '../libs/async.js'
// import type { AppContext } from '@core/context/types'
// import type { PuppetInstance } from '@core/puppet/types'
import type { HtnTask } from '../types/planner.js'

export const executePlan = async (
  plan: any[],
  _origin: any, // | ShadoPuppet | ShadoPlay,
  _context: any, // | PuppetContext | PlayContext,
) => {
  _origin.events.emit('planner', {
    timestamp: Date.now(),
    origin: 'shado-planner-htn',
    data: {
      identifier: 'puppetPlan',
      plan: plan,
    },
  })

  // TODO: Why the every? Just break out of plan if one step fails!
  // NOTE: Loop through the plan's tasks.
  const result = await asyncEvery(plan, async (task: HtnTask) => {
    _context.utils.logger.send({
      type: 'LOG',
      origin: {
        type: 'PUPPET',
        id: _origin.id,
      },
      data: {
        message: `Executing task "${task.identifier}"`,
        // payload: {
        //   task,
        //   // state
        // },
      },
    })

    // NOTE: Debug log!
    // console.log('!!!', 'plan', plan)

    // NOTE: Check if current conditions have been reached.
    if (
      !Object.keys(task.conditions).every((conditionIdentifier) => {
        return task.conditions[conditionIdentifier]({
          _origin,
          _context,
        })
      })
    ) {
      _context.utils.logger.send({
        type: 'WARNING',
        origin: {
          type: 'PUPPET',
          id: _origin.id,
        },
        data: {
          message: `Task "${task.identifier}" skipped`,
        },
      })

      return false
    }

    // NOTE: Run task actions.
    const results: any[] = []

    await asyncForEach(
      Object.keys(task.actions),
      async (actionIdentifier: string) => {
        const result = await task.actions[actionIdentifier]({
          _origin,
          _context,
        })

        // console.log(actionIdentifier, { result })
        results.push(result)
      },
    )

    // TODO: Update logic, apply effects of succeeded tasks.
    // NOTE: Check if it should run the tasks effects.
    if (
      !results.every((result) => {
        // console.log('taskResult', { result })
        return result.success
      })
    ) {
      return false
    }

    // NOTE: Run task effects.
    await asyncForEach(
      Object.keys(task.effects),
      async (effectIdentifier: string) => {
        const result = await task.effects[effectIdentifier].trigger({
          _origin,
          _context,
        })
      },
    )

    return true
  })

  return result
}
