module kaita.entities {
  export interface Template {
    _id?: string;
    staticId: string;
    teamId: string;
    body: string;
    name: string;
    tags: any[];
    title: string;
    index?: number;
  }
}
