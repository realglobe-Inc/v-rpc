import WebSocket from 'ws'

import { Payload, encodePayload } from '../core/Payload'

import { asyncWrapWs } from './asyncWrap'

export const payloadWrap = (ws: WebSocket) => ({
  sendPayload: (payload: Payload) =>
    asyncWrapWs(ws).send(encodePayload(payload)),
})
