import * as WebSocket from 'ws'

/**
 * Wrap wss methods as async methods
 */
export const asyncWrap = (wss: WebSocket.Server) => ({
  waitListening: async () => {
    return new Promise((resolve) => {
      wss.on('listening', () => {
        resolve()
      })
    })
  },
  closeAsync: async () => {
    await new Promise((resolve, reject) => {
      wss.close((err) => err ? reject(err) : resolve())
    })
  }
})