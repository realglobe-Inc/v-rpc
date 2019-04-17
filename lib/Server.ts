import http from 'http'
import Koa from 'koa'
import Router from 'koa-router'
import { ServiceForwarder } from './core/ServiceForwarder'
import { createEndpoints } from './core/Endpoint'

export class Server {
  server: http.Server
  app: Koa
  forwarder: ServiceForwarder

  constructor() {
    const app = new Koa()
    const server = http.createServer(app.callback())
    this.server = server
    this.app = app
    this.forwarder = new ServiceForwarder({ server })
    app.use(this.createRoutes())
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
    const endpoints = createEndpoints(this.forwarder)
    router.get('/services/:serviceId', endpoints.checkService)
    router.post('/services/:serviceId', endpoints.callServiceMethod)
    return router.routes()
  }
}
