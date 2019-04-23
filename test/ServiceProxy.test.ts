import WebSocket from 'ws'
import { strict as assert } from 'assert'
import getPort from 'get-port'
import uuid from 'uuid'

import { WsServiceProxy } from '../lib/core/ServiceProxy'
import {
  ResponsePayload,
  decodePayload,
  encodePayload,
} from '../lib/core/Payload'
import { asyncWrapWss } from '../lib/helpers/asyncWrap'

describe('WsServiceProxy', function() {
  this.timeout(10000)
  let wss: WebSocket.Server
  let port: number

  beforeEach(async () => {
    port = await getPort()
    wss = new WebSocket.Server({
      port,
    })
    await asyncWrapWss(wss).waitListening()
  })

  afterEach(async () => {
    wss.close()
  })

  it('sends request and receives response on call()', async () => {
    const ws = new WebSocket(`http://localhost:${port}`)
    ws.on('message', (message: Buffer) => {
      const resp: ResponsePayload = {
        id: decodePayload(message)!.id,
        payload: 'world',
        type: 'res',
      }
      ws.send(encodePayload(resp))
    })
    const wsOnServer = await asyncWrapWss(wss).waitConnection()

    const serviceProxy = new WsServiceProxy('service01', wsOnServer)
    const callId = uuid()
    const resp = await serviceProxy.call({
      id: callId,
      payload: 'hello',
      type: 'req',
    })
    assert.deepStrictEqual(resp, {
      id: callId,
      payload: 'world',
      type: 'res',
    })
  })
})
