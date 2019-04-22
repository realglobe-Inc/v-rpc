[@v-tools/v-rpc](../README.md) > ["ServiceClient"](../modules/_serviceclient_.md) > [ServiceClient](../classes/_serviceclient_.serviceclient.md)

# Class: ServiceClient

## Hierarchy

**ServiceClient**

## Index

### Constructors

* [constructor](_serviceclient_.serviceclient.md#constructor)

### Properties

* [connectionRetryEnabled](_serviceclient_.serviceclient.md#connectionretryenabled)
* [connectionRetryInterval](_serviceclient_.serviceclient.md#connectionretryinterval)
* [headers](_serviceclient_.serviceclient.md#headers)
* [method](_serviceclient_.serviceclient.md#method)
* [serviceId](_serviceclient_.serviceclient.md#serviceid)
* [timeout](_serviceclient_.serviceclient.md#timeout)
* [url](_serviceclient_.serviceclient.md#url)
* [ws](_serviceclient_.serviceclient.md#ws)

### Methods

* [close](_serviceclient_.serviceclient.md#close)
* [connect](_serviceclient_.serviceclient.md#connect)
* [createWs](_serviceclient_.serviceclient.md#createws)
* [retryConnect](_serviceclient_.serviceclient.md#retryconnect)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ServiceClient**(__namedParameters: *`object`*): [ServiceClient](_serviceclient_.serviceclient.md)

*Defined in ServiceClient.ts:28*

**Parameters:**

**__namedParameters: `object`**

| Name | Type | Default value |
| ------ | ------ | ------ |
| connectionRetryEnabled | `boolean` | true |
| headers | `undefined` \| `object` | - |
| method | `function` | - |
| serviceId | `string` | - |
| timeout | `undefined` \| `number` | - |
| url | `string` | - |

**Returns:** [ServiceClient](_serviceclient_.serviceclient.md)

___

## Properties

<a id="connectionretryenabled"></a>

### `<Private>` connectionRetryEnabled

**● connectionRetryEnabled**: *`boolean`* = true

*Defined in ServiceClient.ts:27*

___
<a id="connectionretryinterval"></a>

### `<Private>` connectionRetryInterval

**● connectionRetryInterval**: *`number`* = 5000

*Defined in ServiceClient.ts:28*

___
<a id="headers"></a>

### `<Optional>` headers

**● headers**: *`undefined` \| `object`*

*Defined in ServiceClient.ts:24*

___
<a id="method"></a>

###  method

**● method**: *[ServiceMethod](../modules/_serviceclient_.md#servicemethod)*

*Defined in ServiceClient.ts:23*

___
<a id="serviceid"></a>

###  serviceId

**● serviceId**: *`string`*

*Defined in ServiceClient.ts:22*

___
<a id="timeout"></a>

### `<Optional>` timeout

**● timeout**: *`undefined` \| `number`*

*Defined in ServiceClient.ts:25*

___
<a id="url"></a>

###  url

**● url**: *`string`*

*Defined in ServiceClient.ts:21*

___
<a id="ws"></a>

### `<Private>` ws

**● ws**: *`WebSocket`*

*Defined in ServiceClient.ts:26*

___

## Methods

<a id="close"></a>

###  close

▸ **close**(): `void`

*Defined in ServiceClient.ts:62*

**Returns:** `void`

___
<a id="connect"></a>

###  connect

▸ **connect**(): `Promise`<`void`>

*Defined in ServiceClient.ts:53*

**Returns:** `Promise`<`void`>

___
<a id="createws"></a>

### `<Private>` createWs

▸ **createWs**(): `WebSocket`

*Defined in ServiceClient.ts:66*

**Returns:** `WebSocket`

___
<a id="retryconnect"></a>

### `<Private>` retryConnect

▸ **retryConnect**(): `void`

*Defined in ServiceClient.ts:101*

**Returns:** `void`

___

