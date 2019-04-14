import { Service } from './Service';
import * as WebSocket from 'ws'
import { RequestPayload, ResponsePayload } from './Payload';

export class WsService implements Service {
  id: string
  ws: WebSocket

  constructor (id: string, ws: WebSocket) {
    this.id = id
    this.ws = ws
  }

  async call(req: RequestPayload) {
    const {ws} = this
    return new Promise((resolve: (res: ResponsePayload) => void, reject) => {
      ws.send(JSON.stringify(req), (err) => {
        if (err) {
          reject(`Failed to call with web socket error: "${err.message}"`)
        }
      })
      ws.addListener('message', function onMessage (message: string) {
        const res = JSON.parse(message) as ResponsePayload
        const isRes = (res: ResponsePayload) => res.id === req.id
        if (isRes(res)) {
          ws.removeListener('message', onMessage)
          resolve(res)
        }
      })
    })
  }
}