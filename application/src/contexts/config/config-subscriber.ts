declare var App: any;
import d = require('./config-defs');
var buildMenu = require('../../utils/build-menu');

var subscriber = Arda.subscriber<d.Props, d.State>((context, subscribe) => {
  var headStyleLink: any = null;

  subscribe('config:relogin', () => {
    app.router.pushContext(require('../login/login-context'));
  });

  subscribe('config:update-config-table', (state) => {
    console.log('update table', state);

    app.config.setAPIToken(state.token);
    app.config.setVimMode(state.vimMode);
    app.config.setTheme(state.theme);
    app.config.setTapActive(state.tapActive);
    app.config.setAllowToSendInfo(state.allowToSendInfo);
    if (state.useDevServer != null) {
      app.config.setUseDevServer(state.useDevServer);
    }

    // Update style if theme changed
    if (!headStyleLink) {
      headStyleLink = document.head.querySelector('link');
    }

    var currentStyleHref = headStyleLink.href;
    if (currentStyleHref.indexOf(state.theme) === -1) {
      var nextStyleHref = 'css/' + state.theme + '-theme.css';
      headStyleLink.href = nextStyleHref;
    }
  });

  var tokenAtEnter;
  subscribe('context:started', (s: string) => {
    app.track('enter-login');
    buildMenu('config');
    tokenAtEnter = app.config.getAPIToken() || '';
  });

  subscribe('config:exit', () => {
    var tokenAtLeave = app.config.getAPIToken() || '';

    // token changed
    if (tokenAtLeave !== '' && tokenAtLeave !== tokenAtEnter) {
      console.log('token changed');
      app.popup.showLoader(__('Checking user data'));
      (<any>Qiita).setEndpoint('https://qiita.com');
      (<any>Qiita).setToken(tokenAtLeave);

      var setup: any = kaita.commands.initialize.setupAtFirstLogin()
      .then(() => {
        app.popup.close();
        app.router.popContext();
        app.track('login-success');
      });
      setup.catch(error => {
        app.popup.close();
        Logger.log('Setup failed');
        app.config.setAPIToken('');
        app.router.popContext();
        app.track('login-failed');
      });
    } else {
      app.router.popContext();
    }
  });

  subscribe('config:changeAPIToken', (s: string) => {
    app.config.setAPIToken(s);
  });

  subscribe('config:changeLoginId', (s: string) => {
    app.config.setLoginId(s);
  });

  subscribe('config:changeVimMode', (bool: boolean) => {
    app.config.setVimMode(bool);
    if (bool) {
      app.track('activate-vim-mode');
    }
  });
});

export = subscriber;
