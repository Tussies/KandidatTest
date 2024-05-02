class PlayerController {
  constructor(game) {
    this.game = game;
    this.canvas = document.getElementById("canvas");
    this.rect = this.canvas.getBoundingClientRect();

    this.moveFunc = this.move.bind(this);
    this.canvas.addEventListener("click", this.moveFunc);
  }

  move(event) {
    this.rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - this.rect.left - 5;
    const y = event.clientY - this.rect.top - 5;

    this.game.move(x, y);
  }

  disableWalk() {
    this.canvas.removeEventListener("click", this.moveFunc);
  }
}

export default PlayerController;
