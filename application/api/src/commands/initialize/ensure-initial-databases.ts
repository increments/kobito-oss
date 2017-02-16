module kaita.commands.initialize {
  export function ensureInitialDatabases(): Promise<any> {
    return Team.save([
      {
        _id: '#inbox',
        local: true,
        name: 'Inbox'
      },
      {
        _id: '#trash',
        local: true,
        name: 'ゴミ箱'
      }
    ]);
  }
}
