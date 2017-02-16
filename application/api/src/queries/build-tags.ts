module kaita.queries {
  var _lastTags: string[] = [];

  export function getTags(): string[] {
    return _lastTags;
  }

  export function buildTags(
    teamId: string
  ): Promise<string[]> {
    return collectTagNames(teamId)
    .then(tags => {
      _lastTags = tags;
      return tags;
    });
  }
}
