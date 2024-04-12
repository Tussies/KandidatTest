class GameController {
    constructor(game, view) {
        this.game = game;
        this.view = view;

        this.quit = this.view.quit;

        this.quit.addEventListener('click', this.goToHomePage.bind(this));
    }

    goToHomePage() {
        this.game.goToHomePage();
    }
} 

export default GameController;