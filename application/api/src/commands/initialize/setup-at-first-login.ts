module kobito.commands.initialize {
  export function setupAtFirstLogin(): Promise<any> {
    var config = kobito.storages.singletons.Config.getInstance();
    return Promise.resolve(kobito.commands.sync.syncTeams())
    .then(() => kobito.commands.sync.syncAllTeamTemplates())
    .then(() => (<any>Qiita).Resources.AuthenticatedUser.get_authenticated_user())
    .then(user => config.setUserObject(user))
    .then(() => kobito.queries.getTeamIds())
    .then(teamIds => kobito.commands.ensureUserId());
  }
}
