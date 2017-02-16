module kaita.storages {
  var StoneSkin = require('stone-skin/with-tv4');

  export class Team extends StoneSkin.IndexedDb<entities.Team> {
    public get storeName() { return 'teams'; }
    public get schema() { return schema.v2.Team; }
  }
}
