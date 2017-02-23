module kobito.commands {
  export function deleteItem(itemId: string) {
    return Item.remove(itemId).then(() => {
      // Remove cache before add
      kobito.queries.removeLastTimelineCache();
    });
  }
}
