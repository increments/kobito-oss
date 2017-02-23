module kobito.storages {
  // var StoneSkin = require('stone-skin/with-tv4');

  export class Log extends StoneSkin.MemoryDb<any> {
    public get storeName() { return 'logs'; }
    // public get schema() { return schema.v2.Log; }
  }
}
