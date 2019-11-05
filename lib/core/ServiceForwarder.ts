import { Server, IncomingMessage } from 'http'

import WebSocket from 'ws'
import Debug from 'debug'

import { asyncWrapWss } from '../helpers/asyncWrap'
import { wssConnectionDetector } from '../helpers/wsConnectDetector'

import { ServiceStore } from './ServiceStore'
import {
  SERVICE_ID_HEADER_NAME,
  SERVICE_TIMEOUT_HEADER_NAME,
} from './Constants'
import { WsServiceProxy } from './ServiceProxy'

const debug = Debug('v-rpc:ServiceForwarder')

export type VerifyService = (req: IncomingMessage) => boolean | Promise<boolean>

export class ServiceForwarder {
  wss: WebSocket.Server
  serviceStore = new ServiceStore()
  stopConnectionDetector: () => void

  constructor({
    server,
    verifyService = () => Promise.resolve(true),
  }: {
    server: Server
    verifyService?: VerifyService
  }) {
    const wss = new WebSocket.Server({
      server,
      verifyClient: this.verifyClient(verifyService),
    })
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
    const serviceTimeout = req.headers[SERVICE_TIMEOUT_HEADER_NAME]
      ? Number(req.headers[SERVICE_TIMEOUT_HEADER_NAME])
      : undefined
    if (!serviceId || typeof serviceId !== 'string') {
      debug(`Web socket terminates for service ID is not given`)
      ws.terminate()
      return
    }
    debug(`Service "${serviceId}" connected`)
    const service = new WsServiceProxy(serviceId, ws, {
      timeout: serviceTimeout,
    })

    this.serviceStore.set(service)

    ws.on('error', (err) => {
      console.error('web socket error', err)
      ws.terminate()
      this.serviceStore.del(service.id)
    })

    ws.on('close', (code: number, reason: string) => {
      debug(`Service "${serviceId}" gone: code=${code}, reason=${reason}`)
      this.serviceStore.del(service.id)
    })
  }

  private onError = (socket: WebSocket, err: Error) => {
    console.error(err)
  }

  private verifyClient = (
    verifyService: VerifyService,
  ): WebSocket.ServerOptions['verifyClient'] => async (info, cb) => {
    const serviceId = info.req.headers[SERVICE_ID_HEADER_NAME]
    if (!serviceId || typeof serviceId !== 'string') {
      cb(false, 400, `Header "${SERVICE_ID_HEADER_NAME}" not given`)
      return
    }
    if (this.serviceStore.has(serviceId)) {
      cb(false, 400, `Service "${serviceId}" is already connected`)
      return
    }

    try {
      const ok = await verifyService(info.req)
      if (ok) {
        cb(true)
      } else {
        cb(false, 401, 'Service verification failed')
      }
    } catch (e) {
      cb(false, 401, 'Service verification failed')
    }
  }
}
