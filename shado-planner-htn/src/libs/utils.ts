import path from 'path'
import { fileURLToPath } from 'url'

export const getCurrent = (url: string) => {
  const filename = fileURLToPath(url)
  const dirname = path.dirname(filename)

  return { filename, dirname }
}
