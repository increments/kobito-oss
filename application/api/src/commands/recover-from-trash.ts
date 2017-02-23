module kobito.commands {
  export function recoverFromTrash(itemId: string)
  : Promise<any> {
    // Remove cache before add
    kobito.queries.removeLastTimelineCache();

    return Item.find(itemId)
    .then(item => {
      item.teamId = item.sentTrashFrom;
      item.sentTrashFrom = null;
      return Item.save(item);
    });
  }
}
