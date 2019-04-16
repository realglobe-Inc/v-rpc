import { strict as assert } from 'assert'
import getPort from 'get-port'
import wait from 'waait'
import { WsForwardServer } from '../lib/core/WsForwardServer'
import { ServiceClient } from '../lib/ServiceClient'

describe('all', function() {
  this.timeout(10000)

  it('WsForwardServer and ServiceClient / case 01', async () => {
    const server = new WsForwardServer()
    const port = await getPort()
    await server.listen(port)

    const serviceId = 'service01'

    const service = new ServiceClient({
      url: `http://localhost:${port}`,
      serviceId,
      method: (arg: string) => Promise.resolve(arg + arg),
    })
    await service.connect()
    await wait(50)

    const response = await server.requestForService(serviceId, {
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
})
