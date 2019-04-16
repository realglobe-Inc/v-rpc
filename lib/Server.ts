import http from 'http'
import Koa, { Context } from 'koa'
import Router from 'koa-router'
import getRawBoy from 'raw-body'
import { WsForwardServer } from './core/WsForwardServer'
import uuid = require('uuid')
import { RequestPayload } from './core/Payload'

export class Server {
  server: http.Server
  app: Koa
  forwarder: WsForwardServer

  constructor() {
    const app = new Koa()
    const server = http.createServer(app.callback())
    app.use(this.createRoutes())
    this.server = server
    this.app = app
    this.forwarder = new WsForwardServer({ server })
  }

  async listen(port: number) {
    await new Promise((resolve) => {
      this.server.listen(port, () => {
        resolve()
      })
    })
  }

  async close() {
    await this.forwarder.close()
    await new Promise((resolve, reject) => {
      this.server.close((err) => (err ? reject(err) : resolve()))
    })
  }

  private createRoutes() {
    const router = new Router()
    router.get('/services/:serviceId', (ctx: Context) => {
      const serviceId = ctx.params.serviceId as string
      if (this.forwarder.serviceStore.has(serviceId)) {
        ctx.status = 200
        ctx.body = 'available'
      } else {
        ctx.status = 404
        ctx.body = 'Service not found'
      }
    })
    router.post('/services/:serviceId', async (ctx: Context) => {
      const serviceId = ctx.params.serviceId as string
      const serviceProxy = this.forwarder.serviceStore.get(serviceId)
      if (!serviceProxy) {
        ctx.status = 404
        ctx.body = 'Service not found'
        return
      }
      const payload = await getRawBoy(ctx.req, {
        length: ctx.req.headers['content-length'],
        limit: '1mb',
        encoding: 'utf-8',
      })
      const requestPayload: RequestPayload = {
        id: uuid(),
        type: 'req',
        payload,
      }
      const responsePayload = await serviceProxy.call(requestPayload)
      ctx.body = responsePayload.payload
    })
    return router.routes()
  }
}
