import WebSocket from 'ws'
import {
  RequestPayload,
  ResponsePayload,
  decodePayload,
  isResponsePayload,
} from './Payload'
import { payloadWrap } from '../helpers/payloadWrap'

export interface ServiceProxy {
  id: string
  call: (arg: RequestPayload) => Promise<ResponsePayload>
  options: {
    timeout?: number
  }
}

export class WsServiceProxy implements ServiceProxy {
  id: string
  ws: WebSocket
  options: ServiceProxy['options']

  constructor(id: string, ws: WebSocket, options?: ServiceProxy['options']) {
    this.id = id
    this.ws = ws
    this.options = options || {}
  }

  async call(req: RequestPayload) {
    const { ws } = this
    // TODO: timeout
    return new Promise(
      (
        resolve: (res: ResponsePayload) => void,
        reject: (reason: string) => void,
      ) => {
        payloadWrap(ws)
          .sendPayload(req)
          .catch((err) =>
            reject(`Failed to call with web socket error: "${err.message}"`),
          )
        ws.addListener('message', function onMessage(message: any) {
          const payload = decodePayload(message) as ResponsePayload
          if (!payload || !isResponsePayload(payload)) {
            return
          }
          const isResponse = payload.type === 'res' && payload.id === req.id
          if (isResponse) {
            ws.removeListener('message', onMessage)
            resolve(payload)
          }
        })
      },
    )
  }
}
