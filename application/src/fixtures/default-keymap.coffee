module.exports =
  app:
    'n': 'main:select-next-team'
    'p': 'main:select-previous-team'
    'j': 'main:select-next-item'
    'down': 'main:select-next-item'
    'k': 'main:select-previous-item'
    'up': 'main:select-previous-item'

    'g': 'main:select-first-item'
    'G': 'main:select-last-item'
    'alt+up': 'main:select-first-item'
    'alt+down': 'main:select-last-item'

    'e': 'main:open-item'
    'E': 'main:edit-item-inline'

    'd': 'main:send-selected-item-to-trash'
    'u': 'main:upload-selected-item'
    'c': 'main:transition:to-editor-as-new-item'
    'C': 'main:create-and-edit-inline'
    'command+n': 'main:transition:to-editor-as-new-item'
    'ctrl+n'   : 'main:transition:to-editor-as-new-item'
    'o': 'main:open-external-preview'
    'r': 'main:sync-items'
    # '?': 'main:show-help'
    '/': 'main:focus-search'
    'ctrl+f': 'main:focus-search'
    'command+f': 'main:focus-search'

    # Meta with plus hacks
    # for US and JIS keyboards
    'ctrl+shift+=': 'zoom:plus'
    'ctrl+shift+;': 'zoom:plus'
    'command+shift+=': 'zoom:plus'
    'command+shift+;': 'zoom:plus'
    'ctrl+-': 'zoom:minus'

    'enter': 'main:open-item'
    'space'      : 'main:scroll-bottom-in-preview'
    'shift+space': 'main:scroll-upper-in-preview'
    'command+,': 'main:transition:to-config'
    'ctrl+,': 'main:transition:to-config'

    # 'command+t': 'main:open-search-popup'
    # 'ctrl+t'   : 'main:open-search-popup'
    # 't'        : 'main:open-search-popup'
  # popup
  popup:
    'right': 'popup:next'
    'left' : 'popup:previous'
    'tab'  : 'popup:next'
    'shift+tab'  : 'popup:previous'
    'enter': 'popup:submit'
    'esc'  : 'popup:cancel'
