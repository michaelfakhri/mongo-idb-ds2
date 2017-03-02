'use strict'

const Ds2 = require('universal-peer-to-peer')
const MetadataHandler = require('./metadataHandler')

class MongoIdbDs2 extends Ds2 {
  constructor (aDBName, indexedFields, options) {
    super(new MetadataHandler(aDBName, {[aDBName]: indexedFields}), options)
  }
  query (aJsonQuery) {
    return super.query(JSON.stringify(aJsonQuery))
  }
}

module.exports = MongoIdbDs2
