'use strict'

const Dexie = require('dexie')
const mongoifyDexie = require('dexie-mongoify/src/dexie.mongoify')

module.exports = class MetadataHandler {

  constructor (aDBName, aJsonSchema) {
    this.dbName = aDBName
    this.tableName = Object.keys(aJsonSchema)[0]
    this.db = new Dexie(aDBName)

    if (Object.keys(aJsonSchema).length !== 1) {
      throw new Error('This metadataHandler must contain one table only')
    }

    this.db.version(1).stores(aJsonSchema)
    this.db.open()
      .catch((err) => { throw err })

  }
  store (fileHash, metadata) {
    metadata.hash = fileHash
    return this.db.collection(this.tableName).insert(metadata)
  }
  get (fileHash) {
    let query = {hash: fileHash}
    return this.db.collection(this.tableName).find(query).toArray()
  }
  query (aQueryStr) {
    let query = JSON.parse(aQueryStr)
    return this.db.collection(this.tableName).find(query).toArray()
  }
}