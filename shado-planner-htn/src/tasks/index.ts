// import type { PuppetInstance } from '@core/puppet/types'
import type { HtnTask } from '../types/planner.js'

export const tasksPool = (
  _origin: any, // | ShadoPuppet | ShadoPlay,
  //
  // _plugins: any,
  _tasks: any,
) => {
  const pool: HtnTask[] = []

  // console.log('!!!', _origin._register.clients)

  const clientsArray = _origin._register.clients.forEach((client: any) => {
    // console.log('!!!', client.plugin.metadata)
    // return client.plugin.metadata.identifier
    try {
      pool.push(
        ...Object.values(
          _tasks[client.plugin.metadata.key] as { [key: string]: HtnTask },
        ),
      )
    } catch (error) {
      // console.log(error)
    }
  })

  // console.log('!!!', { clientsArray })

  // TODO: !!!!
  /*

  // NOTE: Check if there is overlap between all plugins and the puppets clients.
  const intersection = Object.keys(_plugins).filter((value) =>
    clientsArray.includes(value),
  )

  intersection.forEach((identifier: string) => {
  })
    */

  return pool
}
