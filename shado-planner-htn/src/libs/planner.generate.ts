import { asyncForEach } from '../libs/async.js'
// import type { AppContext } from '@core/context/types'
// import type { PuppetInstance } from '@core/puppet/types'
import type { HtnGoal, HtnTask } from '../types/planner.js'

export const generatePlans = async (
  tasksPool: HtnTask[],
  _origin: any, // | ShadoPuppet | ShadoPlay,
  _context: any, // | PuppetContext | PlayContext,
) => {
  const plans: HtnTask[][] = []

  const goalsReached: HtnGoal[] = []
  const goalsUnreached: HtnGoal[] = []

  // NOTE: Loop through current goals and categorise into reached and unreached.
  _origin.memory.goals.forEach((goal: HtnGoal) => {
    const goalResult = goal.evaluator({
      _origin,
      _context,
    })

    if (goalResult) {
      goalsReached.push(goal)
    } else {
      goalsUnreached.push(goal)
    }
  })

  _origin.events.emit('planner', {
    timestamp: Date.now(),
    origin: 'shado-planner-htn',
    data: {
      identifier: 'puppetGoals',
      goals: {
        reached: goalsReached,
        unreached: goalsUnreached,
      },
    },
  })

  // NOTE: Check if current goals have all been reached.
  if (goalsUnreached.length === 0) {
    // NOTE: Debug log!
    // console.log('!!!', 'goalsReached', goalsReached)
    return plans
  }

  // NOTE: Debug log!
  // console.log('!!!', 'goalsUnreached', goalsUnreached)

  // NOTE: Loop through unreached goals, try to find related tasks.
  await asyncForEach(goalsUnreached, async (goal: HtnGoal) => {
    // NOTE: Check if there is a task in the pool that could achieve the goal.
    const relatedTasks = tasksPool.filter((task) => {
      return Boolean(task.effects[goal.identifier])
    })

    // NOTE: No related tasks found.
    if (relatedTasks.length === 0) {
      return
    }

    // NOTE: Debug log!
    // console.log('!!!', 'relatedTasks', relatedTasks)

    const tempPlans: HtnTask[][] = []

    // NOTE: Loop through related tasks, recursively form a plan.
    await asyncForEach(
      // NOTE: Just pick first related task for now.
      [relatedTasks.at(0)],
      async (relatedTask: HtnTask) => {
        const tempPlan: HtnTask[] | null = await _recursivePlanner(
          true,
          relatedTask,
          [],
          tasksPool,
          _origin,
          _context,
        )

        // NOTE: Debug log!
        // console.log('!!!', 'currentPlan', currentPlan)

        // NOTE: Check if full plan is executable.
        if (tempPlan && tempPlan !== null && tempPlan.length > 0) {
          tempPlans.push(tempPlan)
        }
      },
    )

    plans.push(...tempPlans)
  })

  return plans
}

const _recursivePlanner = async (
  success: boolean,
  currentTask: HtnTask,
  currentPlan: HtnTask[],
  tasksPool: HtnTask[],
  _origin: any, // | ShadoPuppet | ShadoPlay,
  _context: any, // | PuppetContext | PlayContext,
) => {
  // NOTE: Early return of the loop.
  if (!success) {
    success = false
    return null
  }

  // NOTE: No more valid tasks.
  if (!currentTask) {
    success = false
    return null
  }

  const conditionsMet: any[] = []
  const conditionsUnmet: any[] = []

  // NOTE: Check conditions of task and categorise them.
  Object.keys(currentTask.conditions).forEach((conditionIdentifier) => {
    const conditionResult = currentTask.conditions[conditionIdentifier]({
      _origin: { ..._origin },
      _context,
    })

    if (conditionResult) {
      conditionsMet.push(conditionIdentifier)
    } else {
      conditionsUnmet.push(conditionIdentifier)
    }
  })

  // NOTE: Debug log!
  // console.log(
  //   '!!!',
  //   currentTask.identifier,
  //   { conditionsMet },
  //   { conditionsUnmet },
  // )

  // NOTE: All task conditions have been met.
  if (conditionsUnmet.length === 0) {
    success = true
    return [currentTask]
  }

  // NOTE: Debug log!
  // console.log('!!!', 'conditionsUnmet', conditionsUnmet)

  // NOTE: Loop through all unmet task conditions.
  conditionsUnmet.forEach(async (conditionIdentifier) => {
    // NOTE: Search for related tasks for the task condition.
    const relatedTasks = tasksPool.filter((relatedTask) => {
      const effectValue = relatedTask.effects[conditionIdentifier]?.value({
        _origin: { ..._origin },
        _context,
      })

      return (
        Object.keys(relatedTask.effects).includes(conditionIdentifier) &&
        effectValue
      )
    })

    // NOTE: No tasks were found for the task conditions.
    if (relatedTasks.length === 0) {
      success = false
      return null
    }

    // NOTE: Add task to plan.
    // NOTE: Just pick first one for now.
    currentPlan.push(relatedTasks[0])

    // NOTE: Re-enter loop to look for more potential tasks to chain.
    return await _recursivePlanner(
      success,
      // NOTE: Just pick first related task for now.
      relatedTasks[0],
      currentPlan,
      tasksPool,
      _origin,
      _context,
    )
  })

  // // NOTE: Couldn't compile a full task chain.
  if (!success) {
    success = false
    return []
  }

  // NOTE: Compiled a full task chain.
  success = true
  return [currentTask, ...currentPlan].reverse()
}
