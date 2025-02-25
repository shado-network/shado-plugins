import { LoggerMessage } from './logger'

export type AbstractLoggerClient = {
  send: (loggerMessage: LoggerMessage) => void
}
