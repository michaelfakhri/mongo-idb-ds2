'use strict'

const Ds2 = require('universal-peer-to-peer')
const MetadataHandler = require('./metadataHandler')

class MongoIdbDs2 extends Ds2 {
  constructor (aDBName, indexedFields) {
    super(new MetadataHandler(aDBName, {aDBName: indexedFields}))
  }
  query (aJsonQuery) {
    return super.query(JSON.stringify(aJsonQuery))
  }
}

module.exports = MongoIdbDs2
