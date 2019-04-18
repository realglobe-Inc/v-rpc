type PayloadType = 'req' | 'res'

interface Payload {
  id: string | null
  payload: string
  type: PayloadType
}

export interface RequestPayload extends Payload {
  id: string
  type: 'req'
}

export interface ResponsePayload extends Payload {
  id: string
  type: 'res'
}

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
