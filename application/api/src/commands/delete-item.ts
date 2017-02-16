module kaita.commands {
  export function deleteItem(itemId: string) {
    return Item.remove(itemId).then(() => {
      // Remove cache before add
      kaita.queries.removeLastTimelineCache();
    });
  }
}
