import WebSocket from 'ws'
import { asyncWrapWss } from '../helpers/asyncWrap'
import {
  ServiceIdNotificationPayload,
  RequestPayload,
  ResponsePayload,
} from './Payload'
import { ServiceStore } from './ServiceStore'
import { WsServiceProxy } from './WsServiceProxy'
import { tryOrNull } from '../helpers/tryOrNull'
import Debug from 'debug'
import { Server } from 'http'

const debug = Debug('v-forward:server')

export class WsForwardServer {
  wss: WebSocket.Server | null = null
  serviceStore = new ServiceStore()

  constructor(options: { server?: Server } = {}) {
    if (options.server) {
      const wss = new WebSocket.Server({ server: options.server })
      wss.on('connection', this.onConnection)
      wss.on('error', this.onError)
      this.wss = wss
    }
  }

  async listen(port: number) {
    if (this.wss) {
      throw new Error(`Wss already exists`)
    }
    const wss = new WebSocket.Server({ port })
    this.wss = wss
    wss.on('connection', this.onConnection)
    wss.on('error', this.onError)
    await asyncWrapWss(wss).waitListening()
  }

  async close() {
    if (!this.wss) {
      throw new Error(`No WebSocket server`)
    }
    await asyncWrapWss(this.wss).closeAsync()
    this.wss = null
  }

  private onConnection = async (ws: WebSocket) => {
    const serviceId = await this.waitServiceId(ws)
    const service = new WsServiceProxy(serviceId, ws)

    this.serviceStore.set(service)

    ws.on('error', (err) => {
      debug('web socket error', err)
    })

    ws.on('close', (code: number, reason: string) => {
      debug(`web socket closed: code = ${code}, reason = ${reason}`)
      this.serviceStore.del(service.id)
    })
  }

  private onError = (socket: WebSocket, err: Error) => {
    console.error(err)
  }

  /**
   * Wait web socket to recieve service id notification
   */
  private async waitServiceId(ws: WebSocket) {
    // TODO: Reject timeout
    return new Promise((resolve: (serviceId: string) => void, reject) => {
      function onMessage(data: any) {
        if (typeof data !== 'string') {
          reject(
            `Invalid message data type for the first message: ${typeof data}`,
          )
          return
        }

        const json = tryOrNull(() => JSON.parse(data))
        if (!json) {
          reject(`JSON parse error: ${data}`)
          return
        }

        const isValid =
          json.type === 'notification:serviceId' &&
          json.payload &&
          typeof json.payload === 'string'
        if (!isValid) {
          reject(`Invalid message data for the first message: ${data}`)
          return
        }

        const notification = json as ServiceIdNotificationPayload
        const serviceId = notification.payload
        resolve(serviceId)
      }

      ws.once('message', onMessage)
    })
  }
}
