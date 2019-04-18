import msgpack from 'msgpack-lite'

export interface RequestPayload {
  id: string
  payload: string | Buffer
  type: 'req'
}

export interface ResponsePayload {
  id: string
  payload: string | Buffer
  type: 'res'
}

export type Payload = RequestPayload | ResponsePayload

export const isRequestPayload = (payload: any) =>
  payload &&
  payload.id &&
  payload.type === 'req' &&
  typeof payload.payload === 'string'
export const isResponsePayload = (payload: any) =>
  payload &&
  payload.id &&
  payload.type === 'res' &&
  typeof payload.payload === 'string'

export const encodePayload = (payload: Payload) => msgpack.encode(payload)
export const decodePayload = (payloadBuf: Buffer) => msgpack.decode(payloadBuf)
