import WebSocket from 'ws'
import Debug from 'debug'

import { asyncWrapWs } from './helpers/asyncWrap'
import { isRequestPayload, decodePayload } from './core/Payload'
import {
  SERVICE_ID_HEADER_NAME,
  SERVICE_TIMEOUT_HEADER_NAME,
} from './core/Constants'
import { wsConnectionDetector } from './helpers/wsConnectDetector'
import { payloadWrap } from './helpers/payloadWrap'
import { notNormalClosureCode } from './helpers/wsClosureCode'

const debug = Debug('v-rpc:ServiceClient')

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
  private connectionRetryEnabled = true
  private connectionRetryInterval = 5000

  constructor({
    url,
    serviceId,
    method,
    headers,
    timeout,
    connectionRetryEnabled = true,
  }: {
    url: string
    serviceId: string
    method: ServiceMethod
    headers?: { [key: string]: string }
    timeout?: number
    connectionRetryEnabled?: boolean
  }) {
    this.url = url
    this.serviceId = serviceId
    this.method = method
    this.headers = headers
    this.timeout = timeout
    this.connectionRetryEnabled = connectionRetryEnabled
  }

  async connect() {
    if (this.ws) {
      this.ws.close(1000)
    }
    this.ws = this.createWs()
    await asyncWrapWs(this.ws).waitOpen()
    debug(`Service "${this.serviceId}" connected to the server`)
  }

  close() {
    this.ws.close(1000)
  }

  private createWs() {
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
      debug(`Message received from server`)
      const payload = decodePayload(message)
      if (!payload || !isRequestPayload(payload)) {
        debug(`Received message is invalid`)
        return
      }
      debug(`Received requset id="${payload.id}"`)
      const { payload: arg } = payload
      const result = await this.method(arg)
      await payloadWrap(ws).sendPayload({
        id: payload.id,
        payload: result,
        type: 'res',
      })
      debug(`Sended response for request id="${payload.id}"`)
    })
    ws.on('close', (code) => {
      if (notNormalClosureCode(code) && this.connectionRetryEnabled) {
        this.retryConnect()
      }
    })
    ws.on('error', (err) => {
      console.error(err)
    })
    return ws
  }

  private retryConnect() {
    debug(`Retry to connect after ${this.connectionRetryInterval} ms`)
    setTimeout(() => {
      void this.connect()
    }, this.connectionRetryInterval)
  }
}
