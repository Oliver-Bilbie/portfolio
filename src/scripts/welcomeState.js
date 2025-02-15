export class WelcomeState {
  #visible = false;

  get isVisible() {
    return this.#visible;
  }

  set isVisible(value) {
    this.#visible = value;
  }
}
