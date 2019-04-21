import uuid from 'uuid'
import getRawBody from 'raw-body'
import { Context } from 'koa'
import { ServiceForwarder } from './ServiceForwarder'
import { RequestPayload } from './Payload'
import { getEncoding } from '../helpers/getEncoding'
import { DEFAULT_SERVICE_TIMEOUT } from './Constants'

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
    ctx.request.socket.setTimeout(
      serviceProxy.options.timeout || DEFAULT_SERVICE_TIMEOUT,
    )

    const hasContentType = getEncoding(ctx.headers['content-type'])
    if (!hasContentType) {
      ctx.status = 400
      ctx.body = `Invalid content type header: "${ctx.headers['content-type']}"`
      return
    }
    const { encoding } = hasContentType

    const payload = await getRawBody(ctx.req, {
      length: ctx.req.headers['content-length'],
      limit: '1mb',
      encoding,
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
