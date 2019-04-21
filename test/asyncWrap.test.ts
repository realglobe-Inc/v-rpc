import WebSocket from 'ws'
import { strict as assert } from 'assert'
import getPort from 'get-port'

import { asyncWrapWss, asyncWrapWs } from '../lib/helpers/asyncWrap'

describe('asyncWrap', function() {
  this.timeout(10000)
  let wss: WebSocket.Server
  let port: number

  beforeEach(async () => {
    port = await getPort()
    wss = new WebSocket.Server({
      port,
    })
  })

  afterEach(async () => {
    wss.close()
  })

  it('wait open / connection', async () => {
    await asyncWrapWss(wss).waitListening()

    const ws = new WebSocket(`http://localhost:${port}`)
    const [connection] = await Promise.all([
      asyncWrapWss(wss).waitConnection(),
      asyncWrapWs(ws).waitOpen(),
    ])
    assert.ok(connection)

    await asyncWrapWss(wss).close()
  })
})
