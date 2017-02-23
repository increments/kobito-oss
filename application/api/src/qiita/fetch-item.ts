module kobito.qiita {
  export function fetchItem(teamId, serverItemId: string) {
    setEndpoint(teamId);
    return Qiita.Resources.Item.get_item(serverItemId);
  }
}
