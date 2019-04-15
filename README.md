# v-forword

RPC forwarding server.

## Spec

+ Service connects to Server
+ Service notify serviceId to Server
+ Server create ServiceProxy with serviceId and ws, and save it in ServiceStore

+ Client send HTTP request to Server
+ Server parse request URL to serviceId
  + `/endpoint/:serviceId`
+ Server find service in ServiceStore
  + if found, next
  + if not found, Server send response 404
+ Server create RequestPayload from client request body
  + { id: uuid, payload: client request body }
+ Server send RequestPayload to Service
+ Service recieve RequestPayload, execute method, and response ResponsePayload
+ Server recieve ResponsePayload from Service
+ Server parse ResponsePayload and send HTTP response to Client
