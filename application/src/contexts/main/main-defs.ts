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
  teams: kaita.entities.Team[];
  templates: kaita.entities.Template[];
}

export interface Template {
  onEdit: boolean;
  selectedItem: kaita.entities.Item;
  selectedTeam: kaita.entities.Team;
  items: kaita.entities.Item[];
  logined: boolean;
  hasNextAsar: boolean;
  latest_version?: string;
  download_link?: string;
  CHANGELOG?: string;
  teams: kaita.entities.Team[];
  filterQuery: string;
}
