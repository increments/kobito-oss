module kaita.storages {
  export class Team extends StoneSkin.IndexedDb<entities.Team> {
    public get storeName() { return 'teams'; }
  }
}
