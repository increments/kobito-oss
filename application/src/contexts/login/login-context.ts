import d = require('./login-defs');
var qs = require('qs');

import subscriber = require('./login-subscriber');
export = Login;
class Login extends Arda.Context<d.Props, d.State, d.Template> {
  get component() {return require('../../components/login');}
  get subscribers() {return [subscriber];}

  public initState(props) {
    return {};
  }

  public expandComponentProps(props, state) {
    var pkg = require('../../../package.json');
    var propStr = qs.stringify({
      client_id: pkg.appId,
      scope: 'read_qiita write_qiita read_qiita_team write_qiita_team',
      state: 'foo'
    });

    var authorizeUrl = 'https://qiita.com/api/v2/oauth/authorize?' + propStr;
    return {
      url: authorizeUrl
    };
  }

}
