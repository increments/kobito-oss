///<reference path='../../types.d.ts' />

import subscriber = require('./main-subscriber');
import zoomSubscriber = require('../zoom-subscriber');
import d = require('./main-defs');

import lifecycleSubscriber = require('./subscribers/lifecycle');
import selectionSubscriber = require('./subscribers/selection');
import itemSubscriber      = require('./subscribers/item');

var pkg = require('../../../package.json');

var fs = require('fs');
var CHANGELOG = kobito.utils.compileMarkdown(
  fs.readFileSync(__dirname + '/../../../CHANGELOG.md').toString()
);

class MainContext extends Arda.Context<d.Props, d.State, d.Template> {
  get component() {return require('../../components/main');}
  get subscribers() {return [
    subscriber,
    zoomSubscriber,
    lifecycleSubscriber,
    selectionSubscriber,
    itemSubscriber
    ];
  }

  // update cached teams and templates
  public updateTeamsAndTemplates() {
    return new Promise(done => {
      return Team.all()
      .then(teams => {
        return Template.all()
        .then(templates => {
          this.update(s => {
            s.teams = teams;
            s.templates = templates.sort((a, b) => {
              return (a.index || 0) - (b.index || 0);
            });
          }).then(done);
        });
      });
    });
  }

  public initState(props) {
    var lastTeamId = app.config.getLastTeamId();
    var selectedTeamId = lastTeamId ? lastTeamId : '#inbox';
    return Team.all()
    .then(teams => {
      // check team only
      var user = app.config.getUserObject();
      if (!!user && user.team_only) {
        teams = teams.filter(t => t._id !== 'qiita');
      }
      return Template.all()
      .then(templates => Promise.resolve({
        teams: teams,
        templates: templates.sort((a, b) => {
          return (a.index || 0) - (b.index || 0);
        }),
        selectedTeamId: selectedTeamId,
        filterQuery: '',
        onEdit: false,
        hasNextAsar: false,
        selectedItemId: null,
        cursorIndex: null
      }));
    });
  }

  public expandComponentProps(props, state): Promise<d.Template> {
    var logined = !!app.config.getAPIToken();
    var templates = state.templates.filter(t => t.teamId === state.selectedTeamId);

    // reject qiita if user is team only
    // and set as inbox
    var user = app.config.getUserObject();
    if (!!user && user.team_only) {
      if (state.selectedTeamId === 'qiita') {
        state.selectedTeamId = '#inbox';
        state.selectedItemId = null;
      }
    }

    var selectedTeam = _.find((<kobito.entities.Team[]>state.teams),
      team => team._id === state.selectedTeamId);

    return kobito.queries.buildTimeline(state.selectedTeamId, state.filterQuery)
    .then(items => Promise.resolve({
      teams: state.teams,
      templates: templates,
      logined: logined,
      filterQuery: state.filterQuery,
      hasNextAsar: state.hasNextAsar,
      latest_version: state.latest_version,
      download_link: state.latest_version_download_link,
      items: items,
      onEdit: state.onEdit,
      CHANGELOG: CHANGELOG,
      selectedItem: _.find(items, i => i._id === state.selectedItemId),
      selectedTeam: selectedTeam
    }));
  }
}

export = MainContext;
