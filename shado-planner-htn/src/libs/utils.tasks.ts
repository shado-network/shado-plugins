import fs from 'fs'
import path from 'path'

import { asyncForEach } from './async.js'
import type { HtnTask } from '../types/planner.js'

export const importTasks = async (tasksPath: string) => {
  const imports: HtnTask[] = []

  const files = fs.readdirSync(tasksPath, {
    recursive: true,
  }) as string[]

  await asyncForEach(files, async (file: string) => {
    if (!file.endsWith('.js') && !file.endsWith('.ts')) {
      return
    }

    // TODO: More checks!
    // TODO: Single level depth!

    try {
      const taskPath = path.join(tasksPath, file)
      const task = await import(taskPath)

      imports.push(task.default)
    } catch (error) {
      console.log('Error loading task', error)
    }
  })

  return imports
}
