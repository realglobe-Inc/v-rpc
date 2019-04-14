import { RequestPayload, ResponsePayload } from './Payload'

export interface Service {
  id: string
  call: (arg: RequestPayload) => Promise<ResponsePayload>
}
