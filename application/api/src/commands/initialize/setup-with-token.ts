module kobito.commands.initialize {
  export function setupWithToken(token: string): Promise<any> {
    var config = kobito.storages.singletons.Config.getInstance();
    if (token == null) {
      return Promise.reject('you got a invalid token');
    }

    config.setAPIToken(token);

    return ensureUserId()
    .then(() => ensureInitialDatabases())
    .then(() => Team.all())
    .then(teams => {
      // Include inbox and trash at least
      if (teams.length < 3) {
        return sync.syncTeamsAndTemplates();
      } else {
        return null;
      }
    });
  }
}
