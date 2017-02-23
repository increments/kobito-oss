module kobito.storages.singletons {
  var uuid = require('uuid');
  var _instance: Config;

  var LOGIN_ID = 'login-id';
  var USER_OBJECT = 'user-object';
  var API_TOKEN = 'api-token';
  var THEME = 'theme';
  var VIM_MODE = 'vim-mode';
  var TAP_ACTIVE = 'tap-active';
  var LAST_TEAM_ID = 'last-team-id';
  var LAST_SHOW_PREVIEW = 'last-show-preview';
  var ALLOW_TO_SEND_INFO = 'send-user-info';
  var BOOT_COUNT = 'boot-count';
  var USE_DEV_SERVER = 'use-dev-server';

  export class Config {
    public static getInstance(): Config {
      if (!_instance) {
        _instance = new Config();
      }
      return _instance;
    }

    private store: any;
    constructor() {
      this.store = new SimpleStorage.Store('config');
    }

    public getLoginId() {
      return this.store.getItem(LOGIN_ID);
    }

    public setLoginId(id: string) {
      this.store.setItem(LOGIN_ID, id);
    }

    public getAPIToken() {
      return this.store.getItem(API_TOKEN);
    }

    public setAPIToken(token: string) {
      if (
        token === "" ||
        token === null ||
        token === 'null' ||
        token === undefined ||
        token === "undefined"
      ) {
        this.store.removeItem(API_TOKEN);
      } else {
        this.store.setItem(API_TOKEN, token);
      }
    }

    public getVimMode() : boolean {
      return this.store.getItem(VIM_MODE) === 'true';
    }

    public setVimMode(bool: boolean): void {
      this.store.setItem(VIM_MODE, bool);
    }

    public getUseDevServer() : boolean {
      return this.store.getItem(USE_DEV_SERVER) === 'true';
    }

    public setUseDevServer(bool: boolean): void {
      this.store.setItem(USE_DEV_SERVER, bool);
    }

    public getLastTeamId() : string {
      return this.store.getItem(LAST_TEAM_ID);
    }

    public setLastTeamId(s: string): void {
      this.store.setItem(LAST_TEAM_ID, s);
    }

    public getLastShowPreview() : boolean {
      return this.store.getItem(LAST_SHOW_PREVIEW);
    }

    public setLastShowPreview(s: boolean): void {
      this.store.setItem(LAST_SHOW_PREVIEW, s);
    }

    public getTapActive() : boolean {
      return this.store.getItem(TAP_ACTIVE) === 'true';
    }

    public setTapActive(s: boolean): void {
      this.store.setItem(TAP_ACTIVE, s);
    }

    public getTheme() : string {
      return this.store.getItem(THEME) || 'default';
    }

    public setTheme(value: string) : void {
      this.store.setItem(THEME, value);
    }

    public getAllowToSendInfo() : boolean {
      return this.store.getItem(ALLOW_TO_SEND_INFO) === 'true';
    }

    public setAllowToSendInfo(value: boolean) : void {
      this.store.setItem(ALLOW_TO_SEND_INFO, value);
    }

    public getBootCount() : number {
      return parseInt(this.store.getItem(BOOT_COUNT), 10) || 0;
    }

    public setBootCount(n : number) : void {
      this.store.setItem(BOOT_COUNT, n);
    }

    public setUserObject(obj: Object) {
      var strjson = JSON.stringify(obj);
      this.store.setItem(USER_OBJECT, strjson);
    }

    public getUserObject()
    : Qiita.Entities.User {
      var strjson = this.store.getItem(USER_OBJECT);
      try {
        return JSON.parse(strjson);
      } catch (e) {
        return undefined;
      }
    }
  }
}
