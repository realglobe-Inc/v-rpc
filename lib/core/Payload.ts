type PayloadType = 'req' | 'res' | 'notification:serviceId'

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

export interface ServiceIdNotificationPayload extends Payload {
  id: null
  type: 'notification:serviceId'
  payload: string
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
export const isServiceIdNotificationPayload = (payload: any) =>
  payload &&
  payload.id === null &&
  payload.type === 'notification:serviceId' &&
  typeof payload.payload === 'string'
