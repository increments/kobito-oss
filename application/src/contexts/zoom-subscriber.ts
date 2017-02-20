var zoomRate = 1.0;
const g: any = global;
var subscriber = (context, subscribe) => {
  var webFrame = g.require('electron').webFrame;
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
