import { strict as assert } from 'assert'
import getPort from 'get-port'
import wait from 'waait'
import fetch from 'node-fetch'
import { ServiceClient } from '../lib/ServiceClient'
import { ForwardServer } from '../lib'
import { IncomingMessage } from 'http'

describe('all', function() {
  this.timeout(10000)

  it('Simple text res / req', async () => {
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

  it('binary data', async () => {
    const server = new ForwardServer()
    const port = await getPort()
    await server.listen(port)

    const serviceId = 'service01'
    const service = new ServiceClient({
      url: `http://localhost:${port}`,
      serviceId,
      method: (arg: Buffer) => Promise.resolve(arg),
    })
    await service.connect()
    await wait(10)

    const resp = await fetch(`http://localhost:${port}/services/${serviceId}`, {
      method: 'POST',
      body: Buffer.from('a'),
    })
    const result = await resp.buffer()
    assert.strictEqual(String(result), 'a')

    await server.close()
  })

  it('verify service', async () => {
    const server = new ForwardServer({
      verifyService: (req: IncomingMessage) => {
        const authorization = req.headers['authorization']
        if (!authorization || typeof authorization !== 'string') {
          return false
        }
        const match = authorization.match(/Bearer (.+)/)
        if (!match) {
          return false
        }
        const token = match[1]
        return token === 'xxxxxx'
      },
    })
    const port = await getPort()
    await server.listen(port)

    {
      const service = new ServiceClient({
        url: `http://localhost:${port}`,
        serviceId: 'service01',
        method: (arg: string) => Promise.resolve(arg),
      })
      await assert.rejects(() => service.connect())
    }

    {
      const service = new ServiceClient({
        url: `http://localhost:${port}`,
        serviceId: 'service01',
        method: (arg: string) => Promise.resolve(arg),
        headers: {
          Authorization: 'Bearer xxxxxx',
        },
      })
      await service.connect()
      service.close()
    }

    await server.close()
  })
})
