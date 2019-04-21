[v-rpc](../README.md) > ["ForwardServer"](../modules/_forwardserver_.md) > [ForwardServer](../classes/_forwardserver_.forwardserver.md)

# Class: ForwardServer

## Hierarchy

**ForwardServer**

## Index

### Constructors

* [constructor](_forwardserver_.forwardserver.md#constructor)

### Properties

* [app](_forwardserver_.forwardserver.md#app)
* [forwarder](_forwardserver_.forwardserver.md#forwarder)
* [http](_forwardserver_.forwardserver.md#http)

### Methods

* [close](_forwardserver_.forwardserver.md#close)
* [createRoutes](_forwardserver_.forwardserver.md#createroutes)
* [listen](_forwardserver_.forwardserver.md#listen)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ForwardServer**(options?: *`object`*): [ForwardServer](_forwardserver_.forwardserver.md)

*Defined in ForwardServer.ts:13*

**Parameters:**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` verifyService | `VerifyService` |

**Returns:** [ForwardServer](_forwardserver_.forwardserver.md)

___

## Properties

<a id="app"></a>

###  app

**● app**: *`Koa`*

*Defined in ForwardServer.ts:12*

___
<a id="forwarder"></a>

###  forwarder

**● forwarder**: *`ServiceForwarder`*

*Defined in ForwardServer.ts:13*

___
<a id="http"></a>

###  http

**● http**: *`Server`*

*Defined in ForwardServer.ts:11*

___

## Methods

<a id="close"></a>

###  close

▸ **close**(): `Promise`<`void`>

*Defined in ForwardServer.ts:31*

**Returns:** `Promise`<`void`>

___
<a id="createroutes"></a>

### `<Private>` createRoutes

▸ **createRoutes**(): `function`

*Defined in ForwardServer.ts:36*

**Returns:** `function`

___
<a id="listen"></a>

###  listen

▸ **listen**(port: *`number`*): `Promise`<`void`>

*Defined in ForwardServer.ts:27*

**Parameters:**

| Name | Type |
| ------ | ------ |
| port | `number` |

**Returns:** `Promise`<`void`>

___

