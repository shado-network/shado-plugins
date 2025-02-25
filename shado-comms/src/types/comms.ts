export type HttpResponse = {
  status: 'success' | 'fail' | 'error'
  timestamp: number
  data:
    | undefined
    | {
        message: string
        [key: string]: unknown
      }
}

export type WebSocketResponse = {
  timestamp: number
  source: string
  data: {
    identifier: string
    [key: string]: unknown
  }
}
