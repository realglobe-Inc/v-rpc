import WebSocket from 'ws'

import { asyncWrapWs } from './helpers/asyncWrap'
import { isRequestPayload, decodePayload } from './core/Payload'
import {
  SERVICE_ID_HEADER_NAME,
  SERVICE_TIMEOUT_HEADER_NAME,
} from './core/Constants'
import { wsConnectionDetector } from './helpers/wsConnectDetector'
import { payloadWrap } from './helpers/payloadWrap'

export type ServiceMethod = (
  arg: string | Buffer,
) => Promise<string | Buffer> | string | Buffer

export class ServiceClient {
  url: string
  serviceId: string
  method: ServiceMethod
  headers?: { [key: string]: string }
  timeout?: number
  private ws: WebSocket

  constructor({
    url,
    serviceId,
    method,
    headers,
    timeout,
  }: {
    url: string
    serviceId: string
    method: ServiceMethod
    headers?: { [key: string]: string }
    timeout?: number
  }) {
    this.url = url
    this.serviceId = serviceId
    this.method = method
    this.headers = headers
    this.timeout = timeout
  }

  async connect() {
    const ws = new WebSocket(this.url, {
      headers: {
        [SERVICE_ID_HEADER_NAME]: this.serviceId,
        ...(this.timeout
          ? { [SERVICE_TIMEOUT_HEADER_NAME]: String(this.timeout) }
          : {}),
        ...(this.headers || {}),
      },
    })
    wsConnectionDetector(ws)
    ws.on('message', async (message: any) => {
      const payload = decodePayload(message)
      if (!payload || !isRequestPayload(payload)) {
        return
      }
      const { payload: arg } = payload
      const result = await this.method(arg)
      await payloadWrap(ws).sendPayload({
        id: payload.id,
        payload: result,
        type: 'res',
      })
    })
    this.ws = ws
    await asyncWrapWs(ws).waitOpen()
  }

  close() {
    this.ws.close()
  }
}
