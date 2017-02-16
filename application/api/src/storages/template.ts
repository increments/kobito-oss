module kaita.storages {
  var StoneSkin = require('stone-skin/with-tv4');

  export class Template extends StoneSkin.IndexedDb<entities.Template> {
    public get storeName() { return 'templates'; }
    public get schema() { return schema.v2.Template; }
  }
}
