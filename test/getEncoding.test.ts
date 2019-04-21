import assert from 'assert'

import { getEncoding } from '../lib/helpers/getEncoding'

describe('getEncoding', () => {
  it('works', () => {
    assert.deepStrictEqual(getEncoding('text/html'), null)
    assert.deepStrictEqual(getEncoding('text/plain'), {
      contentType: 'text/plain',
      encoding: 'utf-8',
    })
    assert.deepStrictEqual(getEncoding('text/plain;charset=shift_jis'), {
      contentType: 'text/plain',
      encoding: 'shift_jis',
    })
    assert.deepStrictEqual(getEncoding('application/json'), {
      contentType: 'application/json',
      encoding: 'utf-8',
    })
    assert.deepStrictEqual(getEncoding('application/octet-stream'), {
      contentType: 'application/octet-stream',
      encoding: null,
    })
  })
})
