import { strict as assert } from 'assert'
import getPort from 'get-port'
import wait from 'waait'
import fetch from 'node-fetch'
import { ServiceClient } from '../lib/ServiceClient'
import { ForwardServer } from '../lib'
import { IncomingMessage } from 'http'
import protobuf from 'protobufjs'

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
      method: (arg: Buffer) => {
        assert.ok(Buffer.isBuffer(arg))
        return Promise.resolve(arg)
      },
    })
    await service.connect()
    await wait(10)

    const resp = await fetch(`http://localhost:${port}/services/${serviceId}`, {
      method: 'POST',
      body: Buffer.from('binary'),
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
    const result = await resp.buffer()
    assert.strictEqual(String(result), 'binary')

    await server.close()
  })

  it('verify service', async () => {
    const server = new ForwardServer({
      verifyService: (req: IncomingMessage) => {
        const authorization = req.headers['authorization']
        if (!authorization) {
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

  it('protocol buffer example', async () => {
    const server = new ForwardServer()
    const port = await getPort()
    await server.listen(port)

    const root = await protobuf.load(__dirname + '/files/greeter.proto')
    const HelloRequest = root.lookupType('HelloRequest')
    const HelloReply = root.lookupType('HelloReply')

    const serviceId = 'service01'
    const service = new ServiceClient({
      url: `http://localhost:${port}`,
      serviceId,
      method: async (data: Buffer) => {
        const decoded = HelloRequest.decode(data)
        const request = HelloRequest.toObject(decoded)
        const response = HelloReply.fromObject({
          message: 'Hello ' + request.name,
        })
        const encoded = HelloReply.encode(response).finish()
        return encoded as Buffer
      },
    })
    await service.connect()

    const requestBody = HelloRequest.encode(
      HelloRequest.fromObject({
        name: 'World',
      }),
    ).finish() as Buffer
    const resp = await fetch(`http://localhost:${port}/services/${serviceId}`, {
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
    const encoded = await resp.buffer()
    const message = HelloReply.decode(encoded)
    const reply = HelloReply.toObject(message)
    assert.strictEqual(reply.message, 'Hello World')

    await server.close()
  })

  it('json rpc example', async () => {
    const server = new ForwardServer()
    const port = await getPort()
    await server.listen(port)

    const serviceId = 'service01'
    const service = new ServiceClient({
      url: `http://localhost:${port}`,
      serviceId,
      method: async (data: string) => {
        const { method, id } = JSON.parse(data)
        if (method === 'hello') {
          return JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: 'world',
          })
        } else {
          return JSON.stringify({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: 'Method not found',
            },
          })
        }
      },
    })
    await service.connect()

    {
      const resp = await fetch(
        `http://localhost:${port}/services/${serviceId}`,
        {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'hello',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      const json = await resp.json()
      assert.strictEqual(json.result, 'world')
    }
    {
      const resp = await fetch(
        `http://localhost:${port}/services/${serviceId}`,
        {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'notFoundMethod',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      const json = await resp.json()
      assert.strictEqual(json.error.code, -32601)
    }

    await server.close()
  })

  it('service not found', async () => {
    const server = new ForwardServer()
    const port = await getPort()
    await server.listen(port)

    const resp = await fetch(`http://localhost:${port}/services/service0000`, {
      method: 'POST',
      body: 'hello',
    })
    assert.ok(!resp.ok)
    assert.strictEqual(resp.status, 404)

    await server.close()
  })
})
