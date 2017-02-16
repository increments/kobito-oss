export = Contact;
class Contact extends Arda.Context<{}, {}, {}> {
  get component() {return require('../../components/contact');}
  public initState(props) {
    return {};
  }
  public expandComponentProps(props, state) {
    return {};
  }

}
