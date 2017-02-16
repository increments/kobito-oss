///<reference path='../../types.d.ts' />

import subscriber = require('./config-subscriber');
import d = require('./config-defs');

export = Config;
class Config extends Arda.Context<d.Props, d.State, d.Template> {
  get component() {return require('../../components/config');}
  get subscribers() {return [subscriber];}

  public initState(props: d.Props) {
    var content = {
      theme: {
        label: __('Theme'),
        type: 'select',
        initialValue: app.config.getTheme(),
        options: ['default', 'dark']
      },
      allowToSendInfo: {
        label: __('Allow to send your usage statistics'),
        type: 'checkbox',
        initialValue: app.config.getAllowToSendInfo()
      },
      vimMode: {
        label: __('Activate Vim-like keymap'),
        type: 'checkbox',
        initialValue: app.config.getVimMode()
      },
      tapActive: {
        label: __('Ring a typing sound'),
        type: 'checkbox',
        initialValue: app.config.getTapActive()
      },
      token: {
        label: __('Access Token'),
        type: 'input',
        initialValue: app.config.getAPIToken()
      }
    };
    return {
      content: content,
      showDebugMenu: false,
      endOfOldVersion: props.endOfOldVersion
    };
  }

  public expandComponentProps(props: d.Props, state: d.State) {
    if (state.showDebugMenu) {
      return {
        showDebugMenu: state.showDebugMenu,
        content: (<any>_).extend(state.content, {
            useDevServer: {
              label: __('Connect to DevServer'),
              type: 'checkbox',
              initialValue: app.config.getUseDevServer()
            }
          }
        )
      };
    } else {
      return state;
    }
  }
}
