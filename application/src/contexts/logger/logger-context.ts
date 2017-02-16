import d = require('./logger-defs');

export = Logger;
class Logger extends Arda.Context<d.Props, d.State, d.Template> {
  get component() {return require('../../components/logger');}
  public initState() {
      return {logs: []};
  }

  public expandComponentProps(props, state) {
    return {logs: state.logs};
  }
}
