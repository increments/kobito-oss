var zoomRate = 1.0;
var subscriber = (context, subscribe) => {
  var webFrame;
  try {
    webFrame = global.require('web-frame');
  } catch(e) {
    webFrame = global.require('electron').webFrame;
  }
  subscribe('zoom:plus', () => {
    if (zoomRate >= 2.5) {
      return;
    }
    zoomRate += 0.1;
    webFrame.setZoomFactor(zoomRate);
  });

  subscribe('zoom:minus', () => {
    // Inhibit too much small
    if (zoomRate <= 0.4) {
      return;
    }
    zoomRate -= 0.1;
    webFrame.setZoomFactor(zoomRate);
  });
};

export = subscriber;
