module.exports =
  onClickHelpCover: (ev) ->
    app.popup.close()

  closePopup: ->
    app.popup.close()

  onKeyUpQuery: (ev) ->
    switch ev.keyCode
      when 27 # esc
        ev.preventDefault()
        app.popup.close()
      when 13 # enter
        ev.preventDefault()
        @dispatch 'popup:open-focused-item'
      when 38 # up
        ev.preventDefault()
        @dispatch 'popup:move-focus-up'
      when 40 # down
        ev.preventDefault()
        @dispatch 'popup:move-focus-down'
      else
        return if ev.ctrlKey or (ev.keyCode is 17) or (ev.keyCode is 13) # ctrl itself or enter
        @dispatch 'popup:change-query', ev.target.value

  onKeyDownQuery: (ev) ->
    if ev.ctrlKey and ev.keyCode is 78 # n
      ev.preventDefault()
      @dispatch 'popup:move-focus-down'
      return
    else if ev.ctrlKey and ev.keyCode is 80 # p
      ev.preventDefault()
      @dispatch 'popup:move-focus-up'
      return
    return true

  #   if ev.ctrlKey and ev.keyCode is 78 # n
  #     ev.preventDefault()
  #     @dispatch 'popup:move-focus-down'
  #     return
  #   else if ev.ctrlKey and ev.keyCode is 80 # p
  #     ev.preventDefault()
  #     @dispatch 'popup:move-focus-up'
  #     return
  #
  #   switch ev.keyCode
  #     when 38 # up
  #       ev.preventDefault()
  #       @dispatch 'popup:move-focus-up'
  #     when 40 # down
  #       ev.preventDefault()
  #       @dispatch 'popup:move-focus-down'
  #
  #   return true
