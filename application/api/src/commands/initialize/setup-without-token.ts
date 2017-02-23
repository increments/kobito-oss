module kobito.commands.initialize {
  export function setupWithoutToken(): Promise<any> {
    return ensureInitialDatabases();
  }
}
