import { Service } from './Service'

/**
 * Store for services connecting to server
 */
export class ServiceStore {
  private services: { [id: string]: Service } = {}

  set(service: Service) {
    this.services[service.id] = service
  }

  get(id: string) {
    return this.services[id]
  }

  del(id: string) {
    delete this.services[id]
  }
}
