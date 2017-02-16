declare module StoneSkin {
  type Id = string;

  class Base<T> {
    validate(t: T): boolean;
  }

  class Async<T> extends Base<T> {
    ready: Promise<any>;
    find(id: Id): Promise<T>;
    select(fn: (t: T) => boolean): Promise<T[]>;
    first(fn: (t: T) => boolean): Promise<T>;
    last(fn: (t: T) => boolean): Promise<T>;
    all(): Promise<T[]>;
    clear(): Promise<any>;
    save(t: T): Promise<T>;
    save(ts: T[]): Promise<T[]>;
    remove(id: Id): Promise<any>;
    remove(ids: Id[]): Promise<any>;
  }

  class Synced<T> extends Base<T> {
    find(id: Id): T;
    select(fn: (t: T) => boolean): T[];
    first(fn: (t: T) => boolean): T;
    last(fn: (t: T) => boolean): T;
    all(): T[];
    clear(): void;
    save(t: T): T;
    save(ts: T[]): T[];
    remove(id: Id): void;
    remove(ids: Id[]): void;
  }

  export class IndexedDb<T> extends Async<T> {
    toMemoryDb(): MemoryDb<T>;
    toSyncedMemoryDb(): SyncedMemoryDb<T>;
  }

  export class MemoryDb<T> extends Async<T> {}
  export class SyncedMemoryDb<T> extends Synced<T> {}
}
