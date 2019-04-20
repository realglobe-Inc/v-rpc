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
export const isPayload = (payload: any) =>
  isRequestPayload(payload) || isResponsePayload(payload)

export const encodePayload = (payload: Payload): Buffer =>
  msgpack.encode(payload)
export const decodePayload = (payloadBuf: any): Payload | null => {
  if (!Buffer.isBuffer(payloadBuf)) {
    return null
  }
  const payload = msgpack.decode(payloadBuf)
  if (!isPayload(payload)) {
    return null
  }
  return payload as Payload
}
