module.exports = class Logger
  @start: ->
    setInterval =>
      @_update()
    , 500

  @_update: ->
    Log.all().then (logs) =>
      now = Date.now()
      logs = logs.filter (log) => now - log.timestamp < 4000
      app.logger.update (s) ->
        s.logs = logs
        return s

  @log: (message) ->
    Log.save({message, type: 'normal', timestamp: Date.now()})

  @warn: (message) ->
    Log.save({message, type: 'warn', timestamp: Date.now()})

  @error: (message) ->
    Log.save({message, type: 'error', timestamp: Date.now()})
