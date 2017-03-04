/* eslint-env mocha */
'use strict'
const MetadataHandler = require('../src/metadataHandler')
const assert = require('chai').assert

describe('MetadataHandler - store', () => {
  let metadata
  before((done) => {
    metadata = new MetadataHandler('testDB1', {testDB1: 'hash, name, year'})
    done()
  })
  it('store 1st item and count', (done) => {
    metadata.store('itemHash1', {name: 'testItem1', year: 2017})
      .then(() => metadata.db.collection(metadata.tableName).count({}))
      .then((count) => assert.strictEqual(count, 1))
      .then(done)
      .catch((err) => { throw err })
  })
  it('store 2nd item and count', (done) => {
    metadata.store('itemHash2', {name: 'testItem2', year: 2001})
      .then(() => metadata.db.collection(metadata.tableName).count({}))
      .then((count) => assert.strictEqual(count, 2))
      .then(done)
      .catch((err) => { throw err })
  })
})
describe('MetadataHandler - delete', () => {
  let metadata
  before((done) => {
    metadata = new MetadataHandler('testDB2', {testDB2: 'hash, name, year'})
    done()
  })
  it('store 2 items then delete one', (done) => {
    metadata.store('itemHash1', {name: 'testItem1', year: 2017})
      .then(() => metadata.store('itemHash2', {name: 'testItem2', year: 2001}))
      .then(() => metadata.db.collection(metadata.tableName).count({}))
      .then((count) => assert.strictEqual(count, 2))
      .then(() => metadata.delete('itemHash2'))
      .then(() => metadata.db.collection(metadata.tableName).count({}))
      .then((count) => assert.strictEqual(count, 1))
      .then(done)
      .catch((err) => { throw err })
  })
})
describe('MetadataHandler - get', () => {
  let metadata
  before((done) => {
    metadata = new MetadataHandler('testDB3', {testDB3: 'hash, name, year'})
    metadata.store('itemHash1', {name: 'testItem1', year: 2017})
      .then(() => metadata.store('itemHash2', {name: 'testItem2', year: 2001}))
      .then((promise) => { /* do nothing */ })
      .then(done)
      .catch((err) => { throw err })
  })
  it('Retrieve using get', (done) => {
    metadata.get('itemHash1')
      .then((items) => assert.sameDeepMembers([items], [{hash: 'itemHash1', name: 'testItem1', year: 2017}]))
      .then(done)
      .catch((err) => { throw err })
  })
  it('Retrieve non-existent using get', (done) => {
    metadata.get('item0')
      .then((items) => assert.sameDeepMembers([items], [undefined]))
      .then(done)
      .catch((err) => { throw err })
  })
})

describe('MetadataHandler - query numeric values', () => {
  let metadata
  before((done) => {
    metadata = new MetadataHandler('testDB4', {testDB4: 'hash, name, year'})
    metadata.store('itemHash1', {name: 'testItem1', year: 2017})
      .then(() => metadata.store('itemHash2', {name: 'testItem2', year: 2001}))
      .then((item) => { /* do nothing */ })
      .then(done)
      .catch((err) => { throw err })
  })
  it('Retrieve using query', (done) => {
    metadata.query(JSON.stringify({year: 2017}))
      .then((items) => assert.sameDeepMembers(items, [{hash: 'itemHash1', name: 'testItem1', year: 2017}]))
      .then(done)
      .catch((err) => { throw err })
  })
  it('Retrieve non-existent using query', (done) => {
    metadata.query(JSON.stringify({year: 3000}))
      .then((items) => assert.sameDeepMembers(items, []))
      .then(done)
      .catch((err) => { throw err })
  })
  it('Retrieve all using query', (done) => {
    metadata.query(JSON.stringify({}))
      .then((items) => assert.sameDeepMembers(items, [{hash: 'itemHash1', name: 'testItem1', year: 2017}, {hash: 'itemHash2', name: 'testItem2', year: 2001}]))
      .then(done)
      .catch((err) => { throw err })
  })
  it('Retrieve newer than 2010 using query', (done) => {
    metadata.query(JSON.stringify({year: {$gt: 2010}}))
      .then((items) => assert.sameDeepMembers(items, [{hash: 'itemHash1', name: 'testItem1', year: 2017}]))
      .then(done)
      .catch((err) => { throw err })
  })
  it('Retrieve newer or as old as 2001 using query', (done) => {
    metadata.query(JSON.stringify({year: {$gte: 2001}}))
      .then((items) => assert.sameDeepMembers(items, [{hash: 'itemHash1', name: 'testItem1', year: 2017}, {hash: 'itemHash2', name: 'testItem2', year: 2001}]))
      .then(done)
      .catch((err) => { throw err })
  })
  it('Retrieve older or as old as 2001 using query', (done) => {
    metadata.query(JSON.stringify({year: {$lte: 2010}}))
      .then((items) => assert.sameDeepMembers(items, [{hash: 'itemHash2', name: 'testItem2', year: 2001}]))
      .then(done)
      .catch((err) => { throw err })
  })
})
