import type { LoggerConfig, LoggerMessage } from '../types/logger'

export class ShadoScreenClient {
  config: LoggerConfig

  constructor(config: LoggerConfig) {
    this.config = config
  }
}
