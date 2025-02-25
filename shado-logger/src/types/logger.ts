export type LoggerClient = 'shado-screen' | 'node-console'

export type LoggerConfig = {
  showIcon: boolean
  showUser: boolean
}

export type LoggerMessage = {
  type: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' | 'LOG' | 'SANDBOX'
  origin: {
    type: 'PLAY' | 'PUPPET' | 'AGENT' | 'USER' | 'PLUGIN'
    id?: string
    name?: string
  }
  data: {
    message: string
    payload?: undefined | unknown
  }
}
