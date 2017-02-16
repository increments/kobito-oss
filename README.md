# Kaita

## Development

```sh
cp config.json.example config.json
```

Optional: Get your own oauth cilent token and set them to `config.json` by https://qiita.com/settings/applications

You can not login Qiita without valid token.

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
