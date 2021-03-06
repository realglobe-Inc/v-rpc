import WebSocket from 'ws'
import wait from 'waait'
import { strict as assert } from 'assert'
import getPort from 'get-port'
import uuid from 'uuid'
import http from 'http'

import { ServiceForwarder } from '../lib/core/ServiceForwarder'
import { asyncWrapWs, asyncHttp } from '../lib/helpers/asyncWrap'
import {
  ResponsePayload,
  RequestPayload,
  decodePayload,
  encodePayload,
} from '../lib/core/Payload'
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
    ws.on('message', (message: Buffer) => {
      const resp: ResponsePayload = {
        id: decodePayload(message)!.id,
        payload: 'world',
        type: 'res',
      }
      ws.send(encodePayload(resp))
    })
    await asyncWrapWs(ws).waitOpen()

    await wait(10)

    assert.ok(forwarder.serviceStore.has('service01'))

    const request: RequestPayload = {
      id: uuid(),
      payload: 'hello',
      type: 'req',
    }
    const resp = await forwarder.serviceStore.get('service01').call(request)
    assert.deepStrictEqual(resp, {
      id: request.id,
      payload: 'world',
      type: 'res',
    })
  })

  it('rejects duplicated service ID', async () => {
    const ws1 = new WebSocket(`http://localhost:${port}`, {
      headers: {
        [SERVICE_ID_HEADER_NAME]: 'service02',
      },
    })
    await asyncWrapWs(ws1).waitOpen()

    await wait(10)

    const ws2 = new WebSocket(`http://localhost:${port}`, {
      headers: {
        [SERVICE_ID_HEADER_NAME]: 'service02',
      },
    })
    await assert.rejects(() => asyncWrapWs(ws2).waitOpen())

    await wait(10)

    assert.ok(forwarder.serviceStore.has('service02'))
  })
})
