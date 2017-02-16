module kaita.commands.initialize {
  var StoneSkin = require('stone-skin/with-tv4');
  export function initStorages(dbVersion) {
    global.Item     = new storages.Item();
    global.Team     = new storages.Team();
    global.Template = new storages.Template();
    global.Username = new storages.Username();
    global.Log      = new storages.Log();

    return Promise.all([
      global.Item.ready,
      global.Team.ready,
      global.Template.ready,
      global.Username.ready,
      global.Log.ready
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
