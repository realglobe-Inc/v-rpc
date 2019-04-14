interface Payload {
  id: string
  payload: string
}

export interface RequestPayload extends Payload {
  type: 'req'
}

export interface ResponsePayload extends Payload {
  type: 'res'
}

export interface NotificationPayload {
  type: 'notification'
}

export interface ServiceIdNotificationPayload extends NotificationPayload {
  notificationType: 'serviceId'
  payload: {
    serviceId: string,
  }
}

export const createRequest = (req: Payload): RequestPayload => ({
  ...req,
  type: 'req',
})

export const createResponse = (res: Payload): ResponsePayload => ({
  ...res,
  type: 'res',
})

export const createIdNotification = (
  serviceId: string,
): ServiceIdNotificationPayload => ({
  type: 'notification',
  notificationType: 'serviceId',
  payload: {
    serviceId,
  },
})
