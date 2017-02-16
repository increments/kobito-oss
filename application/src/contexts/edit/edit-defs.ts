export interface Props {
  itemId: string;
}

export interface Group {
  name: string;
  url_name: string;
}

export interface State {
  item: kaita.entities.Item;
  showPreview: boolean;
  canUpdate: boolean;
  canUpload: boolean;
  teamName: string;
  isLocalTeam: boolean;
  groups?: Group[];
  buffer: {
    title: string;
    body: string;
    tags: kaita.entities.Tag[];
    selectedGroup?: Group;
  };
}

export interface Template extends State {
  templates: {text: string; id: string;}[];
  tagCanditates: string[];
}
