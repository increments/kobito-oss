module kaita.qiita {
  export function fetchLoginUserItems(teamId: string) {
    return kaita.queries.isLocalTeam(teamId)
    .then(isLocalTeam => {
      if (isLocalTeam) {
        return Promise.reject(new Error('Inbox cant sync'));
      }

      setEndpoint(teamId);
      return (<any>Qiita).Resources.AuthenticatedUser.get_authenticated_user();
    })
    .then((data: any) => {
      // TODO: fetch items by correct way
      // var req_count = Math.ceil(data.items_count / per_page);
      var per_page = 100;
      var req_count = 3;
      return Promise.all(
        (<any>_).times(req_count)
        .map(page =>
          // TODO: Use get_authenticated_user and remove loginId
          // Qiita.Resources.Item.list_authenticated_user_items({*/
          Qiita.Resources.Item.list_user_items(data.id, {
            page: (page + 1).toString(),
            per_page: per_page.toString()
          })));
    })
    .then(results => {
      app.track('fetchTimeline');
      return Promise.resolve(_.flatten(results));
    });
  }
}
