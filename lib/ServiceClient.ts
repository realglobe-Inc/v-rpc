import WebSocket from 'ws'
import { asyncWrapWs } from './helpers/asyncWrap'
import {
  ServiceIdNotificationPayload,
  isRequestPayload,
  RequestPayload,
  ResponsePayload,
} from './core/Payload'

export type ServiceMethod = (arg: string) => Promise<string>

export class ServiceClient {
  url: string
  serviceId: string
  method: ServiceMethod
  private ws: WebSocket

  constructor({
    url,
    serviceId,
    method,
  }: {
    url: string
    serviceId: string
    method: ServiceMethod
  }) {
    this.url = url
    this.serviceId = serviceId
    this.method = method
  }

  async connect() {
    const ws = new WebSocket(this.url)
    await asyncWrapWs(ws).waitOpen()
    const idNotification: ServiceIdNotificationPayload = {
      id: null,
      payload: this.serviceId,
      type: 'notification:serviceId',
    }
    ws.send(JSON.stringify(idNotification))
    ws.on('message', async (message: any) => {
      if (typeof message !== 'string') {
        return
      }
      const payload = JSON.parse(message) as RequestPayload
      if (!isRequestPayload(payload)) {
        return
      }
      const { payload: arg } = payload
      const result = await this.method(arg)
      const response: ResponsePayload = {
        id: payload.id,
        type: 'res',
        payload: result,
      }
      ws.send(JSON.stringify(response))
    })
    this.ws = ws
  }

  close() {
    this.ws.close()
  }
}
