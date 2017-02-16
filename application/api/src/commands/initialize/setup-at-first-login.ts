module kaita.commands.initialize {
  export function setupAtFirstLogin(): Promise<any> {
    var config = kaita.storages.singletons.Config.getInstance();
    return Promise.resolve(kaita.commands.sync.syncTeams())
    .then(() => kaita.commands.sync.syncAllTeamTemplates())
    .then(() => (<any>Qiita).Resources.AuthenticatedUser.get_authenticated_user())
    .then(user => config.setUserObject(user))
    .then(() => kaita.queries.getTeamIds())
    .then(teamIds => kaita.commands.ensureUserId());
  }
}
