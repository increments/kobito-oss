const path = require('path');
const {app, ipc, BrowserWindow} = require('electron')

let win = null;

app.on('window-all-closed', function() {
  return app.quit();
});

app.on('ready', function() {
  win = new BrowserWindow({
    width: 1280,
    height: 800
  });
  win.on('closed', () => {
    win = null;
  })
  var url;
  if (process.env.ENV == 'production') {
    url = path.join('file://', __dirname, "app/index-elecron.html");
  } else {
    url = path.join('file://', __dirname, "../../application/public", "index-dev.html");
  }
  win.loadURL(url);
});
