module kobito.queries {
  var _ = require('lodash');

  var _lastItems: kobito.entities.Item[]  = null;

  export function getLastTimeline(): kobito.entities.Item[] {
    return _lastItems;
  }

  // will call from ...
  // 1. team change
  // 2. item added, deleted or updated
  export function removeLastTimelineCache(): void {
    _lastItems = null;
  }

  export function hasLastTimelineCache(): boolean {
    return !!_lastItems;
  }

  var lastBuilt = 0;
  var lastBuiltQueries = {
    teamId: null,
    filterQuery: null
  };

  // Cache flags
  // 1. same arguments
  // 2. has last cache (Cache may be deleted by other)
  // 3. in 1000ms from last call
  // If it fills all, use cache for timeline moving
  export function buildTimeline(
    teamId: string,
    filterQuery: string,
    sortType: boolean = false,
    forceUpdate: boolean = false
  ): Promise<kobito.entities.Item[]> {
    var now = Date.now();
    if (
      lastBuiltQueries.teamId === teamId              // same id
      && lastBuiltQueries.filterQuery === filterQuery // same query
      && (now - lastBuilt) < 1000                     // in 1000ms from last call
      && hasLastTimelineCache()                       // has cache
      && !forceUpdate                                 // not forceUpdate
    ) {
      return Promise.resolve(getLastTimeline());
    }
    lastBuiltQueries.teamId = teamId;
    lastBuiltQueries.filterQuery = filterQuery;

    var queries = filterQuery.split(' ').filter(i => i.length > 0);
    return Item.select(i => i.teamId === teamId)
    .then(_items => {
      var items: kobito.entities.Item[] =
        _.sortBy(_items, i => - i.created_at)
        .filter(i => {
          if (filterQuery.length === 0) {
            return true;
          }

          return queries.every(query => {
            var hasQueryType = query.indexOf(':') > -1;
            var queryType = query.split(':')[0];
            var queryBody = query.split(':')[1];

            if (hasQueryType && queryType && queryBody
              && _.include(['tag', 'body', 'title'], queryType)
            ) {
              var matcher = buildMatcher(queryBody);

              if (queryType === 'title') {
                return matcher(i.title);
              } else if (queryType === 'body') {
                return matcher(i.body);
              } else if (queryType === 'tag') {
                return i.tags.map(t => t.name).some(name => matcher(name));
              }
              return false;
            } else {
              var matcher = buildMatcher(query);
              var titleIncluded = matcher(i.title);
              var bodyIncluded  = matcher(i.body);
              var tagIncluded = i.tags.map(t => t.name).some(name => matcher(name));
              return titleIncluded || bodyIncluded || tagIncluded;
            }
          });
        });
      lastBuilt = Date.now();
      _lastItems = items;
      return Promise.resolve(items);
    });
  }

  function buildMatcher(queryBody: string): (target: string) => boolean {
    try {
      var regexp = new RegExp(queryBody, 'i');
      return text => !!regexp.exec(text);
    } catch(e) {
      return text => text.indexOf(queryBody) > -1;
    }
  }

}
