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

export const isPayload = (payload: any) =>
  payload &&
  payload.id &&
  (typeof payload.payload === 'string' || Buffer.isBuffer(payload.payload))
export const isRequestPayload = (payload: any) =>
  isPayload(payload) && payload.type === 'req'
export const isResponsePayload = (payload: any) =>
  isPayload(payload) && payload.type === 'res'

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
