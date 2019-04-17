import uuid from 'uuid'
import getRawBody from 'raw-body'
import { Context } from 'koa'
import { ServiceForwarder } from './ServiceForwarder'
import { RequestPayload } from './Payload'

export const createEndpoints = (forwarder: ServiceForwarder) => ({
  checkService: async (ctx: Context) => {
    const serviceId = ctx.params.serviceId as string
    if (forwarder.serviceStore.has(serviceId)) {
      ctx.status = 200
      ctx.body = 'available'
    } else {
      ctx.status = 404
      ctx.body = 'Service not found'
    }
  },
  callServiceMethod: async (ctx: Context) => {
    const serviceId = ctx.params.serviceId as string
    const serviceProxy = forwarder.serviceStore.get(serviceId)
    if (!serviceProxy) {
      ctx.status = 404
      ctx.body = 'Service not found'
      return
    }
    const payload = await getRawBody(ctx.req, {
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
  },
})
