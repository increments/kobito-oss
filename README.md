# Kobito

Cross Platform Markdown Processor built on Electron based on Kobito for Windows.

## CAUTION

This repo includes partial and modified sources to publish from http://kobito.qiita.com/win .

Changes to this repo will not be applied to released one.

## Prepare to build

```sh
cp config.json.example config.json
```

Optional: Get your own oauth cilent token and set them to `config.json` by https://qiita.com/settings/applications

You can not login to Qiita without valid token.

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
script/build
cd electron-packager

# mac
script/build-mac

# win
script/build-win
```

We checked passing building on Mac only.

## License

Copyright © 2017 Increments Inc.
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, COMPATIBILITY WITH ANY OTHER SOFTWARE OR PLATFORM, FUTURE UPDATE OR MAINTAINANCE, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
THE ICON OF THE SOFTWARE CAN ONLY BE USED AS A SYMBOL OF THE SOFWARE WITHOUT NO MODIFICATION AND THE LISENSOR RESERVES ALL RIGHTS AS TO THE ICON　OF THE SOFTWARE.

Twemoji is CC-BY 4.0 https://github.com/twitter/twemoji
