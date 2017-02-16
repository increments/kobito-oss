module kaita.queries {
  // Build by last timeline cache for performance
  export function getNeiborItemOnTimeline(
    teamId: string,
    filterQuery: string,
    itemId: string,
    amount: number
  ): kaita.entities.Item {
    var items = getLastTimeline();

    // no cache
    if (items == null) {
      return null;
    }

    // If user did not select any yet, pick first item
    if (itemId == null) {
      return items[0];
    }
    var index = _.findIndex(items, i => i._id === itemId);
    return items[index + amount];
  }
}
