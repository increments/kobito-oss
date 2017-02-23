interface Global {
  Item: any,
  Team: any,
  Template: any,
  Username: any,
  Log: any
}
module kobito.commands.initialize {
  var StoneSkin = require('stone-skin/with-tv4');
  const g: any = global
  export function initStorages(dbVersion) {
    g.Item     = new storages.Item();
    g.Team     = new storages.Team();
    g.Template = new storages.Template();
    g.Username = new storages.Username();
    g.Log      = new storages.Log();

    return Promise.all([
      g.Item.ready,
      g.Team.ready,
      g.Template.ready,
      g.Username.ready,
      g.Log.ready
    ])
    .then(() => {
      return StoneSkin.utils.setupWithMigrate(dbVersion, {
        initialize: () => {
          console.log('init');
        },
        '1to2': storages.migrators.migrate1to2
      });
    });
  }
}
