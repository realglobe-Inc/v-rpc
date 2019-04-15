import { RequestPayload, ResponsePayload } from './Payload'

export interface ServiceProxy {
  id: string
  call: (arg: RequestPayload) => Promise<ResponsePayload>
}
