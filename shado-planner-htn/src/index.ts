import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { tasksPool } from './tasks/index.js'
import { defaultStates } from './states/index.js'
import { plannerLoop } from './libs/planner.loop.js'
import { importTasks } from './libs/utils.tasks.js'

// import type { AppContext } from '@core/context/types'
// import type { PuppetInstance } from '@core/puppet/types'
// import type { AbstractPlugin } from '@core/abstract/types'
import type { HtnTask } from './types/planner.js'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

class ShadoPlannerHTN {
  static metadata = {
    identifier: 'shado-planner-htn',
    description: "Shadō Network's hierarchical task network planner.",
    //
    key: 'planner',
  }

  config: any = {
    // TODO: Implement logger conditional.
    showLogs: true,
  }

  //

  _tasks:
    | undefined
    | {
        [key: string]: {
          [key: string]: HtnTask
        }
      }

  //

  _origin: any // | ShadoPuppet | ShadoPlay
  _context: any // | PuppetContext | PlayContext

  constructor(
    config: any,
    _origin: any, // | ShadoPuppet | ShadoPlay,
    _context: any, // | PuppetContext | PlayContext,
  ) {
    this._context = _context
    this._origin = _origin

    this.config = { ...this.config, ...config }
    this._tasks = {}
  }

  _registerTasks = async () => {
    const tasks: {
      [key: string]: {
        [key: string]: HtnTask
      }
    } = {}

    // TODO: !!!!
    // const imports: HtnTask[] = []
    const __dirname =
      '/Users/reffan/Desktop/O U T L I E R/Projects/20241123 - Shado Network/dev/shado-plugins/shado-planner-htn/src'
    const tasksPath = path.join(__dirname, 'tasks')
    const imports = await importTasks(tasksPath)

    imports.forEach((importedTask) => {
      if (!importedTask) {
        return
      }

      const key: keyof typeof tasks = importedTask.identifier
        .split('-')
        .at(0) as string

      if (!tasks[key]) {
        tasks[key] = {}
      }

      tasks[key][importedTask.identifier] = importedTask
    })

    return tasks
  }

  setup = async () => {
    try {
      this._origin.memory.goals = [
        ...this._origin.memory.goals,
        ...this.config.goals,
      ]

      this._origin.memory.state = {
        'last-started': 0,
        'last-updated': 0,
        //
        ...this._origin.memory.state,
        //
        // NOTE: Telegram default state
        'telegram-has-client': Boolean(this._origin.clients?.['telegram']),
        // 'telegram-has-credentials': undefined,
        ...(this._origin.clients?.['telegram']
          ? defaultStates['telegram']
          : {}),
        // NOTE: Twitter default state
        'twitter-has-client': Boolean(this._origin.clients?.['twitter']),
        // 'twitter-has-credentials': undefined,
        ...(this._origin.clients?.['twitter'] ? defaultStates['twitter'] : {}),
      }

      this._tasks = await this._registerTasks()
    } catch (error) {
      this._context.utils.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PUPPET',
          id: this._origin.id,
        },
        data: {
          message: `Error in planner initialization`,
          payload: { error },
        },
      })
    }
  }

  start = () => {
    const date = new Date()
    this._origin.memory.state['last-started'] = date.valueOf()

    this._origin.events.emit('planner', {
      timestamp: Date.now(),
      origin: 'shado-planner-htn',
      data: {
        identifier: 'puppetState',
        state: this._origin.memory.state,
      },
    })

    plannerLoop(
      // TODO: Make it so it stays dynamic?
      tasksPool(this._origin, this._tasks),
      this._origin,
      this._context,
    )
  }
}

export default ShadoPlannerHTN
