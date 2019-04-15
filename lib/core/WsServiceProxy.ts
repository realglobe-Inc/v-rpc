import WebSocket from 'ws'
import { RequestPayload, ResponsePayload } from './Payload'
import { ServiceProxy } from './ServiceProxy'

export class WsServiceProxy implements ServiceProxy {
  id: string
  ws: WebSocket

  constructor(id: string, ws: WebSocket) {
    this.id = id
    this.ws = ws
  }

  async call(req: RequestPayload) {
    const { ws } = this
    return new Promise(
      (
        resolve: (res: ResponsePayload) => void,
        reject: (reason: string) => void,
      ) => {
        ws.send(JSON.stringify(req), (err) => {
          if (err) {
            reject(`Failed to call with web socket error: "${err.message}"`)
          }
        })
        ws.addListener('message', function onMessage(message: string) {
          const res = JSON.parse(message) as ResponsePayload
          const isRes = (res: ResponsePayload) =>
            res.type === 'res' && res.id === req.id
          if (isRes(res)) {
            ws.removeListener('message', onMessage)
            resolve(res)
          }
        })
      },
    )
  }
}
