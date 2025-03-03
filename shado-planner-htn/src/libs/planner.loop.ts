import { asyncForEach, asyncSleep } from '../libs/async.js'
import { generatePlans } from './planner.generate.js'
import { executePlan } from './planner.execute.js'
// import type { AppContext } from '@core/context/types'
// import type { PuppetInstance } from '@core/puppet/types'
import type { HtnTask } from '../types/planner.js'

const config = {
  AWAIT_PLANNING_FOR_X_SECONDS: 1,
  RETRY_PLANNING_IN_X_SECONDS: 5,
}

export const plannerLoop = async (
  tasksPool: HtnTask[],
  _origin: any, // | ShadoPuppet | ShadoPlay,
  _context: any, // | PuppetContext | PlayContext,
) => {
  // NOTE: Disable for debugging purposes.
  // console.clear()

  const date = new Date()
  _origin.memory.state['last-updated'] = date.valueOf()

  _origin.events.emit('planner', {
    timestamp: Date.now(),
    origin: 'shado-planner-htn',
    data: {
      identifier: 'puppetState',
      state: _origin.memory.state,
    },
  })

  // NOTE: Check if any goals have been set.
  if (!_origin.memory.goals || Object.keys(_origin.memory.goals).length === 0) {
    _context.utils.logger.send({
      type: 'LOG',
      origin: {
        type: 'PUPPET',
        id: _origin.id,
      },
      data: {
        message: 'No goals have been set',
        // payload: { state: _origin.memory.state },
      },
    })

    await asyncSleep(config.RETRY_PLANNING_IN_X_SECONDS)
    plannerLoop(tasksPool, _origin, _context)

    return
  }

  // _context.utils.logger.send({
  //   type: 'LOG',
  //   origin: {
  //     type: 'PUPPET',
  //     id: _origin.id,
  //   },
  //   data: {
  //     message: 'Generating plans',
  //   },
  // })

  // NOTE: Generate plans for the current goals.
  const plans = await generatePlans(tasksPool, _origin, _context)

  // NOTE: Check if any plans have been generated.
  if (!plans || plans.length === 0) {
    _context.utils.logger.send({
      type: 'LOG',
      origin: {
        type: 'PUPPET',
        id: _origin.id,
      },
      data: {
        message: 'No plan found for current goals',
        // payload: {
        //   goals: Object.keys(_origin.memory.goals),
        //   state: _origin.memory.state,
        // },
      },
    })

    await asyncSleep(config.RETRY_PLANNING_IN_X_SECONDS)
    plannerLoop(tasksPool, _origin, _context)

    return
  }

  let arePlansExecuted = true

  // TODO: Pick a plan for every goal, execute synchronously if possible?
  // TODO: Add goal key? Then pick from multiple options per goal.
  await asyncForEach(plans, async (plan: HtnTask[]) => {
    // NOTE: Check if picked plan is valid.
    if (!plan || plan.length === 0) {
      _context.utils.logger.send({
        type: 'LOG',
        origin: {
          type: 'PUPPET',
          id: _origin.id,
        },
        data: {
          message: 'No plan found for current goals',
          // payload: {
          //   goals: Object.keys(_origin.memory.goals),
          //   state: _origin.memory.state,
          // },
        },
      })

      await asyncSleep(config.RETRY_PLANNING_IN_X_SECONDS)
      plannerLoop(tasksPool, _origin, _context)

      return
    }

    const isPlanExecuted = await executePlan(plan, _origin, _context)

    if (!isPlanExecuted) {
      arePlansExecuted = false
    }
  })

  // NOTE: Check if plans succeeded. Set retry timeout for the loop accordingly.
  if (arePlansExecuted) {
    _context.utils.logger.send({
      type: 'INFO',
      origin: {
        type: 'PUPPET',
        id: _origin.id,
      },
      data: {
        message: 'All plans executed successfully',
        // payload: { state: _origin.memory.state },
      },
    })

    // await asyncSleep(config.AWAIT_PLANNING_FOR_X_SECONDS)
  } else {
    _context.utils.logger.send({
      type: 'WARNING',
      origin: {
        type: 'PUPPET',
        id: _origin.id,
      },
      data: {
        message: 'Some plans skipped',
        // payload: { state: _origin.memory.state },
      },
    })

    await asyncSleep(config.RETRY_PLANNING_IN_X_SECONDS)
  }

  _origin.events.emit('planner', {
    timestamp: Date.now(),
    origin: 'shado-planner-htn',
    data: {
      identifier: 'puppetState',
      state: _origin.memory.state,
    },
  })

  // NOTE: Enter the planning loop after timeout.
  plannerLoop(tasksPool, _origin, _context)
}
