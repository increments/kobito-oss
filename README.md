# Kaita

## Development

```sh
script/build
npm install -g electron
electron electron-packager/browser
```

Development with file watch
```
cd application
yarn run watch
```

## Release build

```sh

cd electron-packager

# mac
script/build-mac

# win
script/build-win
```

## License

MIT
