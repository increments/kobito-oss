module kobito.commands {
  export function sendToTrash(itemId: string)
  : Promise<any> {
    // Remove cache before add
    kobito.queries.removeLastTimelineCache();

    return Item.find(itemId)
    .then(item => {
      item.sentTrashFrom = item.teamId;
      item.teamId = '#trash';
      return Item.save(item);
    });
  }
}
