module.exports = [
  {
    label: 'Kobito'
    submenu: [
      {
        label: __('Preference')
        key: '[Meta]+,'
        event: 'main:transition:to-config'
        active: ['main']
      }

      {
        label: __('Quit'),
        key: '[Meta]+Q'
        click: ->
          global.require('electron').remote.app.quit()
      }
    ]
  }

  {
    label: __('Team'),
    submenu: [
      {
        label: __('Fetch items')
        key: '[Meta]+R'
        active: ['main']
      }

      {
        label: __('Select the next team')
        active: ['main']
        event: 'main:select-next-team'
      }
      {
        label: __('Select the previous team')
        active: ['main']
        event: 'main:select-previous-team'
      }
    ]
  }

  {
    label: __('Item')
    submenu: [
      {
        label: __('New Item')
        key: '[Meta]+N'
        event: 'main:transition:to-editor-as-new-item'
        active: ['main']
      }

      {
        label: __('Edit')
        key: '[Meta]+E'
        active: ['main']
        event: 'main:open-item'
      }

      {
        label: __('Delete')
        key: '[Meta]+D'
        event: 'main:send-selected-item-to-trash'
        active: ['main']
      }

      {
        label: __('Upload')
        key: '[Meta]+U',
        event: 'main:upload-selected-item'
        active: ['main']
      }

      {
        label: __('External Preview')
        # key: '[Meta]+O',
        event: 'main:open-external-preview'
        active: ['main']
      }

      {
        label: __('Open file')
        key: '[Meta]+O',
        event: 'main:open-files'
        active: ['main']
      }

      {
        label: __('Export')
        active: ['main']
        event: 'main:export-selected-item'
      }

    ]
  }

  {
    label: __('Window')
    submenu: [
      {
        label: __('Zoom In')
        key: '[Meta]+plus'
        event: 'zoom:plus'
      }
      {
        label: __('Zoom Out')
        key: '[Meta]+-'
        event: 'zoom:minus'
      }
    ]
  }

  {
    label: __('Help')
    submenu: [
      {
        label: __('Questions or Feedback')
        event: 'help:feedback'
      }
    ]
  }
]
