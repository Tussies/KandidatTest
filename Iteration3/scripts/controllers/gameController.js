class GameController {
  constructor(game, view) {
    this.game = game;
    
    this.manual = view.manual;
    this.quit = view.quit;

    this.quit.addEventListener("click", this.goToHomePage.bind(this));

    this.manual.addEventListener("click", this.openInstructions.bind(this))
  }

  goToHomePage() {
    this.game.goToHomePage();
  }

  openInstructions(){
    window.open("/iteration3/menudesign/InstructionsManual/instructions.html", "_blank")
  }
}

export default GameController;
