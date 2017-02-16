import subscriber = require('./popup-subscriber');
import d = require('./popup-defs');

export = Popup;
class Popup extends Arda.Context<d.Props, d.State, d.Template> {
  get component() {return require('../../components/popup');}
  get subscribers() {return [subscriber]; }

  public initState(props) {
    return {
      type: 'none',
      focusIndex: 0
    };
  }

  public expandComponentProps(props, state) {
    return state;
  }

  public showWithChoices(message: string, choices: d.Choice[], raw = false, focusIndex = 0) {
    this.update(state => ({
      type: 'choices',
      message: message,
      focusIndex: focusIndex,
      raw: raw,
      choices: choices
    }));
  }

  public showWelcomeMessage(next: Function) {
    this.update(state => ({
      type: 'welcome',
      onClickNext: () => {
        next();
      }
    }));
  }

  public showLoader(message: string) {
    this.update(state => ({
      type: 'loading-spinner',
      message: message
    }));
  }

  public showSearch() {
    this.update(state => ({
      type: 'search',
      hitItems: [],
      focusIndex: 0
    }));
  }

  public showHelp(message: string) {
    this.update(state => ({
      type: 'help'
    }));
  }

  public showUploadCheckDialog(onClickYesToPost: Function, onClickNoToPost: Function) {
    app.popup.getActiveComponent().setState({checkedForUpdate: false});
    this.update(state => ({
      type: 'upload-check-dialog',
      onClickYesToPost: onClickYesToPost,
      onClickNoToPost: onClickNoToPost
    }));
  }

  public showUploadCheckDialogForTeam(onClickYesToPost: Function, onClickNoToPost: Function) {
    app.popup.getActiveComponent().setState({checkedForCoedit: false});
    this.update(state => ({
      type: 'upload-check-dialog-for-team',
      onClickYesToPost: () => {
        onClickYesToPost(this.getActiveComponent().state);
      },
      onClickNoToPost: onClickNoToPost
    }));
  }

  public showErrorStack(message: string, stack: string) {
    this.update(state => ({
      type: 'error',
      message: message,
      stack: stack,
      onSelectReload: () => location.reload(),
      onSelectIgnore: () => app.popup.close()
    }));
  }

  close() {
    this.update(state => ({
       type: 'none'
    }));
  }
}
