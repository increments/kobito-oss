module kaita.queries {
  export function collectTagNames(
    teamId: string
  ): Promise<string[]> {
    return Item.select(item => item.teamId === teamId)
    .then(items => {
      return _.uniq(_.flatten(
        items.map(item => item.tags.map(tag => tag.name))
      ));
    });
  }
}
