export interface Props {
}

export interface State {
  selectedTeamId: string;
  filterQuery: string;
  cursorIndex?: number;
  selectedItemId?: string;

  latest_version?: string;
  latest_version_download_link?: string;
  hasNextAsar: boolean;
  onEdit: boolean;

  // cache for performance
  teams: kobito.entities.Team[];
  templates: kobito.entities.Template[];
}

export interface Template {
  onEdit: boolean;
  selectedItem: kobito.entities.Item;
  selectedTeam: kobito.entities.Team;
  items: kobito.entities.Item[];
  logined: boolean;
  hasNextAsar: boolean;
  latest_version?: string;
  download_link?: string;
  CHANGELOG?: string;
  teams: kobito.entities.Team[];
  filterQuery: string;
}
