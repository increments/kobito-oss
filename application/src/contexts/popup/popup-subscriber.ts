import d = require('./popup-defs');
var subscriber = Arda.subscriber<d.Props, d.State>((context, subscribe) => {
  subscribe('popup:next', () => {
    if (context.state.type === 'choices') {
      context.update(s => {
        var n = context.state.focusIndex + 1;
        if (context.state.choices.length > n) {
          s.focusIndex = n;
        } else {
          s.focusIndex = 0;
        }
        return s;
      });
    }
  });

  subscribe('popup:previous', () => {
    if (context.state.type === 'choices') {
      context.update(s => {
        var n = context.state.focusIndex - 1;
        if (n >= 0) {
          s.focusIndex = n;
        } else {
          s.focusIndex = context.state.choices.length - 1;
        }
        return s;
      });
    }
  });

  subscribe('popup:submit', () => {
    var $focused = jQuery(".modal_content_button:eq(" + context.state.focusIndex + ")");
    $focused.click();
  });

  subscribe('popup:cancel', () => {
    context.update(s => ({type: 'none'}));
    /*context.update({});*/
  });

  subscribe('popup:change-query', (query) => {
    // TODO: refactor aggregate items
    var teamId = app.router.activeContext.state.selectedTeamId;

    kaita.queries.buildTimeline(teamId, query)
    .then(items => {
      context.update(s => {
        s.hitItems = items;
        s.focusIndex = 0;
        return s;
      });
    });
  });

  subscribe('popup:open-focused-item', () => {
    var item = context.state.hitItems[context.state.focusIndex];
    if (item) {
      context.update(s => ({type: 'none'}));
      app.router.activeContext.emit('main:transition:to-editor-with-item', item._id);
    }
  });

  subscribe('popup:move-focus-up', () => {
    context.update(s => {
      if (s.focusIndex > 0) {
        s.focusIndex = s.focusIndex - 1;
      }
      return s;
    });
  });

  subscribe('popup:move-focus-down', () => {
    context.update(s => {
      if (s.focusIndex < s.hitItems.length - 1) {
        s.focusIndex = s.focusIndex + 1;
      }
      return s;
    });
  });
});

export = subscriber;
