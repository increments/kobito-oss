module kaita.qiita {
  export function setEndpoint(teamId: string): void {
    var Q: any = Qiita;

    // TODO: move anyselect or rename this
    var config = kaita.storages.singletons.Config.getInstance();
    Q.setToken(config.getAPIToken());

    if (teamId === 'qiita') {
      Q.setEndpoint('https://qiita.com');
    } else {
      Q.setEndpoint('https://' + teamId + '.qiita.com');
    }
  }
}
