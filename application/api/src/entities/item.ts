module kaita.entities {
  export interface Item {
    _id?: string;
    body: string;
    title: string;
    tags: Tag[];
    group?: Group;
    teamId: string;
    compiled_body: string;
    sentTrashFrom?: string; // last team id
    syncedItemId?: string; // if it exists, item is uploaded.
    created_at?: number;
    local_updated_at?: number;
    remote_updated_at?: number;
    synced_at?: number;
    conflict_item?: Qiita.Entities.Item;
    coediting?: boolean;
  }
}
