import d = require('./edit-defs');
import Context = require('./edit-context');

export interface SaveReport {
  error: boolean;
  message: string;
  nextItem?: kobito.entities.Item;
}

export function parseBufferText(
  buffer: string
): {title: string; body: string;} {
  var lines = buffer.split('\n');
  var title = lines[0];
  var body = lines.slice(1).join('\n');
  return {title: title, body: body};
}

export function parseTagString(tagText: string): kobito.entities.Tag[] {
  var raw = tagText.split(/\s+|,/);
  var tags: kobito.entities.Tag[] = _(raw).uniq().compact().map(tagName => ({name: tagName})).value();
  return tags;
}

export function isItemTouched(
  buffer: {title: string; body: string; tags: kobito.entities.Tag[]; group: any},
  oldItem: kobito.entities.Item
) : boolean {
  var updatable = false;
  if (buffer.title !== oldItem.title) {
    updatable = true;
  }
  if (buffer.body !== oldItem.body) {
    updatable = true;
  }

  if (buffer.tags.map(e => e.name).join() !== oldItem.tags.map(e => e.name).join()) {
    updatable = true;
  }

  if (
    (buffer.group == null && oldItem.group != null) ||
    (buffer.group != null && oldItem.group == null)
  ) {
    updatable = true;
  }

  if (buffer.group != null && oldItem.group != null) {
    if (buffer.group.url_name !== oldItem.group.url_name) {
      updatable = true;
    }
  }

  return updatable;
}

export function isItemUploadable(
  item: kobito.entities.Item
) : boolean {
  if (item.teamId === '#inbox') {
    return false;
  }
  if (item.teamId === 'qiita' && item.tags.length === 0) {
    return false;
  } else if (item.synced_at == null) {
    return false;
  } else if (item.local_updated_at <= item.synced_at) {
    return false;
  }
  return true;
}

export function getCurrentDoc(context: Arda.Context<d.Props, d.State, d.Template>):
{title: string; body: string; tags: kobito.entities.Tag[]; group: any;} {
    return {
      title: context.state.buffer.title,
      body : context.state.buffer.body,
      tags : context.state.buffer.tags,
      group : context.state.buffer.selectedGroup
    };
}

export function tryToSave(context: Arda.Context<d.Props, d.State, d.Template>): Promise<SaveReport> {
  return new Promise<SaveReport>(done => {

    var doc = getCurrentDoc(context);
    if (context.props.itemId != null) {
      Item.find(context.props.itemId)
      .then(item => {
        if (isItemTouched(doc, item)) {
          item.title = doc.title;
          item.body = doc.body;
          item.tags = doc.tags;
          item.group = doc.group;

          kobito.commands.updateItem(item).then(item => {
            done({
              error: false,
              message: __('saved: {}', item.title),
              nextItem: item
            });
          });
        } else {
          done({
            error: false,
            message: __('didn\'t change: {}', item.title)
          });
        }
      });
    } else {
      throw new Error('Item is not defined');
    }
  });
}

export function createInitialBuffer(item: {title: string; body: string;}): string {
  if (item.title.length === 0 && item.body.length === 0) {
    return '';
  }
  return item.title + '\n' + item.body;
}

export function createInitialTagBuffer(item: {tags: {name: string;}[];}): string {
  return item.tags.map(tag => tag.name).join(' ');
}
