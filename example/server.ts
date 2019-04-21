import { ForwardServer } from '../lib'

const server = new ForwardServer()

void server.listen(5000).then(() => {
  console.log(`Server listening on port ${5000}`)
})
