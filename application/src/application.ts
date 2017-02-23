///<reference path='types.d.ts' />

declare var app: Application;
var pkg = require('../package');
var Arda = require('arda')

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
  config:  kobito.storages.singletons.Config;

  constructor() {
    this.config = kobito.storages.singletons.Config.getInstance();
  }

  resetAll(): void {
    require('./utils/reset-storages').resetAll();
  }

  track(key: string, obj: any = {}) {
    // Track user data here
  }
}
export = Application;
