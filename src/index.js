'use strict'

const Ds2 = require('ds2')
const MetadataHandler = require('./MetadataHandler')

class MongoIdbDs2 extends Ds2 {
  constructor (aDBName, indexedFields, options) {
    super(new MetadataHandler(aDBName, {[aDBName]: indexedFields}), options)
  }
  query (aJsonQuery, hops) {
    return super.query(JSON.stringify(aJsonQuery), hops)
  }
}

module.exports = MongoIdbDs2
