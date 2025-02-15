export class WelcomeState {
  #visible = true;

  get isVisible() {
    return this.#visible;
  }

  set isVisible(value) {
    this.#visible = value;
  }
}
