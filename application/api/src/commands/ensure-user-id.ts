module kaita.commands {
  export function ensureUserId(): Promise<any> {
    var config = kaita.storages.singletons.Config.getInstance();
    if (!config.getAPIToken()) {
      return Promise.reject('you are not logined');
    }

    if (!!config.getLoginId()) {
      return Promise.resolve(config.getLoginId());
    }

    return (<any>Qiita).Resources.AuthenticatedUser.get_authenticated_user()
    .then(data => {
      if (!data || !data.id) {
        return Promise.reject('network or login faild');
      }
      config.setLoginId(data.id);
      return Promise.resolve(data.id);
    });
  }
}
