module kaita.storages {
  var StoneSkin = require('stone-skin/with-tv4');
  export class Item extends StoneSkin.IndexedDb<entities.Item> {
    public get storeName() { return 'items';}
    public get schema() {return schema.v2.Item;}
  }
}
