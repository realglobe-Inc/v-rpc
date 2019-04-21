import { ServiceClient } from '../lib'

const publicMethod = (name: string) => 'Hello ' + name + '\n'

const service = new ServiceClient({
  url: `http://localhost:5000`,
  serviceId: 'hello_service',
  method: publicMethod,
})

void service.connect().then(() => {
  console.log(`Service connected to the server`)
})
