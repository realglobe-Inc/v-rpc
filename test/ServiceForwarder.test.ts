import WebSocket from 'ws'
import wait from 'waait'
import { strict as assert } from 'assert'
import { ServiceForwarder } from '../lib/core/ServiceForwarder'
import getPort from 'get-port'
import uuid from 'uuid'
import http from 'http'
import { asyncWrapWs, asyncHttp } from '../lib/helpers/asyncWrap'
import { ResponsePayload, RequestPayload } from '../lib/core/Payload'
import { SERVICE_ID_HEADER_NAME } from '../lib'

describe('WsForwardServer', function() {
  this.timeout(10000)
  let port: number
  let server: http.Server
  let forwarder: ServiceForwarder

  beforeEach(async () => {
    server = http.createServer()
    forwarder = new ServiceForwarder({
      server,
    })
    port = await getPort()
    await asyncHttp(server).listen(port)
  })

  afterEach(async () => {
    await forwarder.close()
    await asyncHttp(server).close()
  })

  it('works', async () => {
    const ws = new WebSocket(`http://localhost:${port}`, {
      headers: {
        [SERVICE_ID_HEADER_NAME]: 'service01',
      },
    })
    ws.on('message', (message: string) => {
      const resp: ResponsePayload = {
        id: JSON.parse(message).id,
        type: 'res',
        payload: 'world',
      }
      ws.send(JSON.stringify(resp))
    })
    await asyncWrapWs(ws).waitOpen()

    await wait(10)

    assert.ok(forwarder.serviceStore.has('service01'))

    const request: RequestPayload = {
      id: uuid(),
      type: 'req',
      payload: 'hello',
    }
    const resp = await forwarder.serviceStore.get('service01').call(request)
    assert.deepStrictEqual(resp, {
      id: request.id,
      type: 'res',
      payload: 'world',
    })
  })
})
