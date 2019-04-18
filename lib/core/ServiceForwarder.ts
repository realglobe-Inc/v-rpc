import WebSocket from 'ws'
import { asyncWrapWss } from '../helpers/asyncWrap'
import { ServiceStore } from './ServiceStore'
import { WsServiceProxy } from './ServiceProxy'
import Debug from 'debug'
import { Server, IncomingMessage } from 'http'
import { SERVICE_ID_HEADER_NAME } from './Constants'
import { wssConnectionDetector } from '../helpers/wsConnectDetector'

const debug = Debug('v-forward:server')

export class ServiceForwarder {
  wss: WebSocket.Server
  serviceStore = new ServiceStore()
  stopConnectionDetector: () => void

  constructor(
    options: {
      server?: Server
      verifyClient?: WebSocket.ServerOptions['verifyClient']
    } = {},
  ) {
    const wss = new WebSocket.Server(options)
    wss.on('connection', this.onConnection)
    wss.on('error', this.onError)
    this.stopConnectionDetector = wssConnectionDetector(wss)
    this.wss = wss
  }

  async close() {
    this.stopConnectionDetector()
    await asyncWrapWss(this.wss).close()
  }

  private onConnection = async (ws: WebSocket, req: IncomingMessage) => {
    const serviceId = req.headers[SERVICE_ID_HEADER_NAME]
    if (!serviceId || typeof serviceId !== 'string') {
      ws.terminate()
      return
    }
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
}
