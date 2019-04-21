[v-rpc](../README.md) > ["ServiceClient"](../modules/_serviceclient_.md) > [ServiceClient](../classes/_serviceclient_.serviceclient.md)

# Class: ServiceClient

## Hierarchy

**ServiceClient**

## Index

### Constructors

* [constructor](_serviceclient_.serviceclient.md#constructor)

### Properties

* [headers](_serviceclient_.serviceclient.md#headers)
* [method](_serviceclient_.serviceclient.md#method)
* [serviceId](_serviceclient_.serviceclient.md#serviceid)
* [timeout](_serviceclient_.serviceclient.md#timeout)
* [url](_serviceclient_.serviceclient.md#url)
* [ws](_serviceclient_.serviceclient.md#ws)

### Methods

* [close](_serviceclient_.serviceclient.md#close)
* [connect](_serviceclient_.serviceclient.md#connect)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ServiceClient**(__namedParameters: *`object`*): [ServiceClient](_serviceclient_.serviceclient.md)

*Defined in ServiceClient.ts:22*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| headers | `undefined` \| `object` |
| method | `function` |
| serviceId | `string` |
| timeout | `undefined` \| `number` |
| url | `string` |

**Returns:** [ServiceClient](_serviceclient_.serviceclient.md)

___

## Properties

<a id="headers"></a>

### `<Optional>` headers

**● headers**: *`undefined` \| `object`*

*Defined in ServiceClient.ts:20*

___
<a id="method"></a>

###  method

**● method**: *[ServiceMethod](../modules/_serviceclient_.md#servicemethod)*

*Defined in ServiceClient.ts:19*

___
<a id="serviceid"></a>

###  serviceId

**● serviceId**: *`string`*

*Defined in ServiceClient.ts:18*

___
<a id="timeout"></a>

### `<Optional>` timeout

**● timeout**: *`undefined` \| `number`*

*Defined in ServiceClient.ts:21*

___
<a id="url"></a>

###  url

**● url**: *`string`*

*Defined in ServiceClient.ts:17*

___
<a id="ws"></a>

### `<Private>` ws

**● ws**: *`WebSocket`*

*Defined in ServiceClient.ts:22*

___

## Methods

<a id="close"></a>

###  close

▸ **close**(): `void`

*Defined in ServiceClient.ts:72*

**Returns:** `void`

___
<a id="connect"></a>

###  connect

▸ **connect**(): `Promise`<`void`>

*Defined in ServiceClient.ts:44*

**Returns:** `Promise`<`void`>

___

