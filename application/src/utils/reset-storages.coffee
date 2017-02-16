getDbNames = -> new Promise (done, reject) ->
  req = indexedDB.webkitGetDatabaseNames()
  req.addEventListener 'success', (event) ->
    dbNames = (i for i in event.target.result)
    done(dbNames)
  req.addEventListener 'error', (event) ->
    reject()

removeAllIndexedDb = (dbNames) ->
  Promise.all(
    dbNames.map (name) -> new Promise (done, reject) ->
      req = indexedDB.deleteDatabase(name)
      req.addEventListener 'success', ->
        done()
      req.addEventListener 'error', ->
        reject()
  )

resetAllIndexedDb = -> new Promise (done) ->
  getDbNames().then (names) ->
    removeAllIndexedDb(names).then ->
      console.info 'all items removed!'
      done()

resetAllIndexedDbWithoutInbox = -> new Promise (done) ->
  getDbNames().then (names) ->
    namesWithoutInbox = names.filter (name) -> (name.indexOf 'inbox') > -1
    removeAllIndexedDb(namesWithoutInbox).then ->
      console.info 'all items removed!'
      done()

exports.resetAll = ->
  localStorage.clear()
  resetAllIndexedDb()

exports.resetIndexedDb = ->
  resetAllIndexedDb()

exports.resetIndexedDbWithoutInbox = ->
  resetAllIndexedDbWithoutInbox()
