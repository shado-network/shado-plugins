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
  origin: string
  data: {
    identifier: string
    [key: string]: unknown
  }
}
