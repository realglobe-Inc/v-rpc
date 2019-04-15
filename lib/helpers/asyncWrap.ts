import WebSocket from 'ws'

/**
 * Wrap wss methods as async methods
 */
export const asyncWrapWss = (wss: WebSocket.Server) => ({
  waitListening: async () => {
    return new Promise((resolve) => {
      wss.on('listening', () => {
        resolve()
      })
    })
  },
  waitConnection: async () => {
    return new Promise((resolve: (ws: WebSocket) => void) => {
      wss.once('connection', (ws) => resolve(ws))
    })
  },
  closeAsync: async () => {
    await new Promise((resolve, reject) => {
      wss.close((err) => (err ? reject(err) : resolve()))
    })
  },
})

export const asyncWrapWs = (ws: WebSocket) => ({
  waitOpen: async () => {
    return new Promise((resolve) => {
      ws.once('open', () => resolve())
    })
  },
})
