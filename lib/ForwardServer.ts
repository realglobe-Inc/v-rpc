import http from 'http'

import Koa from 'koa'
import Router from 'koa-router'

import { ServiceForwarder, VerifyService } from './core/ServiceForwarder'
import { createEndpoints } from './core/Endpoint'
import { asyncHttp } from './helpers/asyncWrap'
import { Routes } from './core/Constants'

export class ForwardServer {
  http: http.Server
  app: Koa
  forwarder: ServiceForwarder

  constructor(options: { verifyService?: VerifyService } = {}) {
    const app = new Koa()
    const server = http.createServer(app.callback())
    this.http = server
    this.app = app
    this.forwarder = new ServiceForwarder({
      server,
      verifyService: options.verifyService,
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
    router.get(Routes.SERVICE, endpoints.checkService)
    router.post(Routes.SERVICE, endpoints.callServiceMethod)
    return router.routes()
  }
}
