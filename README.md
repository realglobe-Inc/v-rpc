# v-rpc

RPC forwarding server. `v-rpc` makes your local function public RPC method.

## 1 minute example

Install v-rpc.

```
$ npm install @v-tools/v-rpc
```

Server code.

```js
const { ForwardServer } = require('@v-tools/v-rpc')

const server = new ForwardServer()

void server.listen(5000).then(() => {
  console.log(`Server listening on port ${5000}`)
})
```

Service client code.

```js
const { ServiceClient } = require('@v-tools/v-rpc')

const publicMethod = (name: string) => 'Hello ' + name + '\n'

const service = new ServiceClient({
  method: publicMethod,
  serviceId: 'hello_service',
  url: `http://localhost:5000`,
})

void service.connect().then(() => {
  console.log(`Service connected to the server`)
})
```

Call service method by curl.

```
$ curl -X POST -H "Content-Type: text/plain" -d "John" http://localhost:5000/services/hello_service
Hello John
```

## API Documentation

[API Documentation](doc/README.md)
