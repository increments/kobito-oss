///<reference path='types.d.ts' />

declare var app: Application;
var pkg = require('../package');

// for arda
import MainContext   = require('./contexts/main/main-context');
import ConfigContext = require('./contexts/config/config-context');
import EditContext   = require('./contexts/edit/edit-context');
import LoginContext  = require('./contexts/login/login-context');
import PopupContext  = require('./contexts/popup/popup-context');
import LoggerContext = require('./contexts/logger/logger-context');
import ContactContext = require('./contexts/contact/contact-context');

class Application {
  router: Arda.Router;
  popup: Arda.Context<any, any, any>;
  config:  kaita.storages.singletons.Config;

  constructor() {
    this.config = kaita.storages.singletons.Config.getInstance();
  }

  resetAll(): void {
    require('./utils/reset-storages').resetAll();
  }

  track(key: string, obj: any = {}) {
    obj.version = pkg.version;
    if (global.mixpanel && app.config.getAllowToSendInfo()) {
      global.mixpanel.identify(app.config.getTrackingId());
      global.mixpanel.track(key, obj);
    }
  }
}
export = Application;
