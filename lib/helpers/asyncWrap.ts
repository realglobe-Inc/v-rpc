import WebSocket from 'ws'
import { Server, ClientRequest, IncomingMessage } from 'http'

/**
 * Wrap wss methods as async methods
 */
export const asyncWrapWss = (wss: WebSocket.Server) => ({
  close: async () => {
    await new Promise((resolve, reject) => {
      wss.close((err) => (err ? reject(err) : resolve()))
    })
  },
  waitConnection: async () => {
    return new Promise((resolve: (ws: WebSocket) => void) => {
      wss.once('connection', (ws) => resolve(ws))
    })
  },
  waitListening: async () => {
    return new Promise((resolve) => {
      wss.on('listening', () => {
        resolve()
      })
    })
  },
})

/**
 * Wrap ws methods as async methods
 */
export const asyncWrapWs = (ws: WebSocket) => ({
  send: async (data: any) => {
    return new Promise((resolve, reject) => {
      ws.send(data, (err?: Error) => (err ? reject(err) : resolve()))
    })
  },
  waitOpen: async () => {
    return new Promise((resolve, reject) => {
      ws.once(
        'unexpected-response',
        (req: ClientRequest, res: IncomingMessage) => reject(res.statusMessage),
      )
      ws.once('open', () => resolve())
    })
  },
})

export const asyncHttp = (server: Server) => ({
  close: async () => {
    return new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()))
    })
  },
  listen: async (port: number) => {
    return new Promise((resolve) => {
      server.listen(port, () => {
        resolve()
      })
    })
  },
})
