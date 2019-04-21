import { strict as assert } from 'assert'
import { ServiceProxy } from '../lib/core/ServiceProxy'
import { ServiceStore } from '../lib/core/ServiceStore'

describe('ServiceStore', () => {
  const createService = (): ServiceProxy => ({
    id: '01',
    call: () => null as any,
    options: {},
  })
  it('works as store', () => {
    const store = new ServiceStore()
    assert.ok(!store.has('01'))
    const service = createService()
    store.set(service)
    assert.ok(store.has(service.id))
    store.del(service.id)
    assert.ok(!store.has(service.id))
  })
})
