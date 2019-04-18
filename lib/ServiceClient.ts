import WebSocket from 'ws'
import { asyncWrapWs } from './helpers/asyncWrap'
import {
  isRequestPayload,
  RequestPayload,
  ResponsePayload,
  decodePayload,
  encodePayload,
} from './core/Payload'
import { SERVICE_ID_HEADER_NAME } from './core/Constants'

export type ServiceMethod = (arg: string | Buffer) => Promise<string | Buffer>

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
    const ws = new WebSocket(this.url, {
      headers: {
        [SERVICE_ID_HEADER_NAME]: this.serviceId,
      },
    })
    await asyncWrapWs(ws).waitOpen()
    ws.on('message', async (message: any) => {
      if (!Buffer.isBuffer(message)) {
        return
      }
      const payload = decodePayload(message) as RequestPayload
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
      await asyncWrapWs(ws).send(encodePayload(response))
    })
    this.ws = ws
  }

  close() {
    this.ws.close()
  }
}
