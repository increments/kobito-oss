module kaita.storages {
  export class Template extends StoneSkin.IndexedDb<entities.Template> {
    public get storeName() { return 'templates'; }
    public get schema() { return schema.v2.Template; }
  }
}
