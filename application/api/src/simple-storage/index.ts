module SimpleStorage {
  declare var localStorage: any;
  export class Store {
    constructor(public key: string) {
    }

    public clear() {
      localStorage.clear();
    }

    public getItem(key: string): string {
      return localStorage.getItem(key);
    }

    public removeItem(key: string): void {
      return localStorage.removeItem(key);
    }

    public setItem(key: string, val: any): void {
      localStorage.setItem(key, val);
    }
  }
}
