import WebSocket from 'ws'
import wait from 'waait'
import { strict as assert } from 'assert'
import { WsForwardServer } from '../lib/core/WsForwardServer'
import getPort from 'get-port'
import uuid from 'uuid'
import { asyncWrapWs } from '../lib/helpers/asyncWrap'
import {
  ResponsePayload,
  ServiceIdNotificationPayload,
  RequestPayload,
} from '../lib/core/Payload'

describe('WsForwardServer', function() {
  this.timeout(10000)
  let port: number
  let server: WsForwardServer

  beforeEach(async () => {
    server = new WsForwardServer()
    port = await getPort()
    await server.listen(port)
  })

  afterEach(async () => {
    await server.close()
  })

  it('works', async () => {
    const ws = new WebSocket(`http://localhost:${port}`)
    ws.on('message', (message: string) => {
      const resp: ResponsePayload = {
        id: JSON.parse(message).id,
        type: 'res',
        payload: 'world',
      }
      ws.send(JSON.stringify(resp))
    })
    await asyncWrapWs(ws).waitOpen()

    const notification: ServiceIdNotificationPayload = {
      id: null,
      type: 'notification:serviceId',
      payload: 'service01',
    }
    ws.send(JSON.stringify(notification))

    await wait(50)

    assert.ok(server.serviceStore.has('service01'))

    const request: RequestPayload = {
      id: uuid(),
      type: 'req',
      payload: 'hello',
    }
    const resp = await server.requestForService('service01', request)
    assert.deepStrictEqual(resp, {
      id: request.id,
      type: 'res',
      payload: 'world',
    })
  })
})
