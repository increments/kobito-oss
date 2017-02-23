module kobito.storages {
  // var StoneSkin = require('stone-skin/with-tv4');
  //
  export class Username extends StoneSkin.MemoryDb<any> {
    public get storeName() { return 'usernames'; }
    public get schema() { return schema.v2.Username; }
  }
}
