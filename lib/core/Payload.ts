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
