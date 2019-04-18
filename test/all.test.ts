import { strict as assert } from 'assert'
import getPort from 'get-port'
import wait from 'waait'
import fetch from 'node-fetch'
import { ServiceClient } from '../lib/ServiceClient'
import { ForwardServer } from '../lib'

describe('all', function() {
  this.timeout(10000)

  it('case 01', async () => {
    const server = new ForwardServer()
    const port = await getPort()
    await server.listen(port)

    const serviceId = 'service01'

    const service = new ServiceClient({
      url: `http://localhost:${port}`,
      serviceId,
      method: (arg: string) => Promise.resolve(arg + arg),
    })
    await service.connect()
    await wait(30)

    const serviceProxy = server.forwarder.serviceStore.get(serviceId)
    const response = await serviceProxy.call({
      id: 'method01',
      type: 'req',
      payload: 'hello',
    })
    assert.deepStrictEqual(response, {
      id: 'method01',
      type: 'res',
      payload: 'hellohello',
    })
    await server.close()
  })

  it('case 02', async () => {
    const server = new ForwardServer()
    const port = await getPort()
    await server.listen(port)

    const serviceId = 'service01'
    const service = new ServiceClient({
      url: `http://localhost:${port}`,
      serviceId,
      method: (arg: string) => Promise.resolve(arg + arg),
    })
    await service.connect()
    await wait(30)

    const resp = await fetch(`http://localhost:${port}/services/${serviceId}`, {
      method: 'POST',
      body: 'hello',
    })
    const result = await resp.text()
    assert.strictEqual(result, 'hellohello')
    await server.close()
  })
})
