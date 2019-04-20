import uuid from 'uuid'
import getRawBody from 'raw-body'
import { Context } from 'koa'
import { ServiceForwarder } from './ServiceForwarder'
import { RequestPayload } from './Payload'

const ContentType = {
  TEXT: 'text/plain',
  BINARY: 'application/octet-stream',
}

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
    const contentTypeString: string = ctx.headers['content-type'] || ''
    const [contentType, parameter] = contentTypeString
      .split(';')
      .map((s) => s.trim())

    if (![ContentType.TEXT, ContentType.BINARY].includes(contentType)) {
      ctx.status = 400
      ctx.body = `Invalid content type header: "${contentTypeString}"`
      return
    }

    const encoding = (() => {
      if (contentType === ContentType.TEXT) {
        if (parameter && parameter.includes('charset=')) {
          const charset = parameter.match(/charset=([A-Za-z0-9_-]+)/)![1]
          return charset
        } else {
          return 'utf-8'
        }
      } else {
        return null
      }
    })()

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
