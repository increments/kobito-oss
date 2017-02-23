module kobito.commands {
  export function transferItem(
    itemId: string,
    nextTeamId: string
  ): Promise<any> {
    return Item.find(itemId)
    .then(i => {
      i.teamId = nextTeamId;
      i.syncedItemId = null;
      i.remote_updated_at = null;
      i.synced_at = null;
      return Item.save(i);
    });
  }

  export function transferItems(
    teamId: string,
    otherTeamId: string
  ) {
    return Item.select(i => i.teamId === teamId)
    // update id in items
    .then(items => {
      // TODO: avoid [] removing
      if (items.length === 0) {
        return Promise.resolve();
      }

      // reject at same target
      if (teamId === otherTeamId) {
        return Promise.reject(new Error("move target is same id"));
      }

      var itemsToMove = items.map(i => {
        i.teamId = otherTeamId;
        i.syncedItemId = null;
        i.remote_updated_at = null;
        i.synced_at = null;
        return i;
      });
      return Item.save(itemsToMove);
    })
    // remove team
    .then(() => Team.remove(teamId));
  }
}
