import { ServiceClient } from '../lib'

const publicMethod = (name: string) => 'Hello ' + name + '\n'

const service = new ServiceClient({
  method: publicMethod,
  serviceId: 'hello_service',
  url: `http://localhost:5000`,
})

void service.connect().then(() => {
  console.log(`Service connected to the server`)
})
