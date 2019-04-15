import { ServiceProxy } from './ServiceProxy'

/**
 * Store for services connecting to server
 */
export class ServiceStore {
  private services: { [id: string]: ServiceProxy } = {}

  set(service: ServiceProxy) {
    this.services[service.id] = service
  }

  get(id: string) {
    return this.services[id]
  }

  has(id: string) {
    return Boolean(this.get(id))
  }

  del(id: string) {
    delete this.services[id]
  }
}
