import http from 'http'
import Koa from 'koa'
import Router from 'koa-router'
import { ServiceForwarder } from './core/ServiceForwarder'
import { createEndpoints } from './core/Endpoint'
import { asyncHttp } from './helpers/asyncWrap'

export class ForwardServer {
  http: http.Server
  app: Koa
  forwarder: ServiceForwarder

  constructor() {
    const app = new Koa()
    const server = http.createServer(app.callback())
    this.http = server
    this.app = app
    this.forwarder = new ServiceForwarder({
      server,
    })
    app.use(this.createRoutes())
  }

  async listen(port: number) {
    await asyncHttp(this.http).listen(port)
  }

  async close() {
    await this.forwarder.close()
    await asyncHttp(this.http).close()
  }

  private createRoutes() {
    const router = new Router()
    const endpoints = createEndpoints(this.forwarder)
    router.get('/services/:serviceId', endpoints.checkService)
    router.post('/services/:serviceId', endpoints.callServiceMethod)
    return router.routes()
  }
}
