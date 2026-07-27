export class WelcomeState {
  #visible = false;
  #hasTyped = false;

  get isVisible() {
    return this.#visible;
  }

  set isVisible(value) {
    this.#visible = value;
  }

  get hasTyped() {
    return this.#hasTyped;
  }

  set hasTyped(value) {
    this.#hasTyped = value;
  }
}
