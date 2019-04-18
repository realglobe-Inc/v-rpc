import WebSocket from 'ws'

const noop = () => undefined

type WebSocketAlive = WebSocket & { isAlive: boolean }
type WebSocketPing = WebSocket & { pingTimeout: NodeJS.Timeout }
type IntervalOption = { interval: number }

export const wssConnectionDetector = (
  wss: WebSocket.Server,
  options: IntervalOption = { interval: 30000 },
) => {
  const { interval } = options
  wss.on('connection', (ws: WebSocketAlive) => {
    ws.isAlive = true
    ws.on('pong', () => {
      ws.isAlive = true
    })
  })
  const timer = setInterval(() => {
    wss.clients.forEach((ws: WebSocketAlive) => {
      if (ws.isAlive === false) {
        ws.terminate()
        return
      }
      ws.isAlive = false
      ws.ping(noop)
    })
  }, interval)
  return function stop() {
    clearInterval(timer)
  }
}

export const wsConnectionDetector = (
  client: WebSocket,
  options: IntervalOption = { interval: 30000 + 2000 },
) => {
  const _client = (client as any) as WebSocketPing
  const { interval } = options
  function heartbeat() {
    clearTimeout(_client.pingTimeout)
    _client.pingTimeout = setTimeout(() => {
      client.terminate()
    }, interval)
  }
  client.on('open', heartbeat)
  client.on('ping', heartbeat)
  client.on('close', function clear() {
    clearTimeout(_client.pingTimeout)
  })
}
