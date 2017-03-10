/* eslint-env mocha */
'use strict'
const assert = require('chai').assert
const Ds2 = require('ds2')

const MongoIdbDs2 = require('../src')

describe('MongoIdbDs2 - instance', () => {
  it('instance', (done) => {
    let instance = new MongoIdbDs2('test1', 'index1, index2, index3')
    assert.instanceOf(instance, MongoIdbDs2)
    done()
  })
  it('instance of super class Ds2', (done) => {
    let instance = new MongoIdbDs2('test2', 'index1, index2, index3')
    assert.instanceOf(instance, Ds2)
    done()
  })
})

describe('MongoIdbDs2 - query', () => {
  it('query', (done) => {
    let node = new MongoIdbDs2('test3', 'hash, index1, index2, index3')
    node.start()
      .then(() => node.publish('itemData1', {index1: 'metadata1', index2: 'metadata2', index3: 'metadata3'}))
      .then(() => node.query({}))
      .then((list) => {
        assert.strictEqual(list.length, 1)
        assert.strictEqual(list[0].result.length, 1)
      })
      .then(done)
      .catch((err) => { throw err })
  })
})
