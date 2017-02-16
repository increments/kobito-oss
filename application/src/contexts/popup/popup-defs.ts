export interface Props {
}

export interface Choice {
  text: string;
  onSelect: Function;
}

export interface State {
  type: string;
  focusIndex?: number;
  message?: string;
  choices?: Choice[];
  hitItems?: kaita.entities.Item[];
  onClickYesToPost?: Function;
  onClickNext?: Function;
  onSelectReload?: Function;
  onSelectIgnore?: Function;
}

export interface Template extends State {
}
