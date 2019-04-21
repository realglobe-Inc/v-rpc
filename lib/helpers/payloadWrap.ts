import WebSocket from 'ws'

import { asyncWrapWs } from './asyncWrap'
import { Payload, encodePayload } from '../core/Payload'

export const payloadWrap = (ws: WebSocket) => ({
  sendPayload: (payload: Payload) =>
    asyncWrapWs(ws).send(encodePayload(payload)),
})
