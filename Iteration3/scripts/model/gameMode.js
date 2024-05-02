import Mode from "./Mode.js";
import MapData from "./map.js";
import Player from "./player.js";
import PlayerController from "../controllers/playerController.js";
import GameView from "../views/gameView.js";
import PlayerView from "../views/playerView.js";
import GameController from "../controllers/gameController.js";

class GameMode extends Mode {
  constructor(image, jsongraph) {
    super();
    this.jsonGraph = jsongraph;

    this.gameState = {
      startNode: null,
      playerNode: null,
      image: image,
      controlNodes: {},
      completed: false,
      shortestPath: null,
      playerPath: null,
    };

    this.gameView = new GameView(this, image.naturalWidth, image.naturalHeight);
    this.playerView = new PlayerView(this);

    this.playerController = new PlayerController(this);
    this.gameController = new GameController(this, this.gameView);

    this.takenControls = 0;
  }

  async initcourse() {
    await this.mapData.loadJSON(this.jsonGraph);

    this.player = new Player(this.mapData.getGraph());

    this.gameState.startNode = this.mapData.getNode(1);
    this.gameState.playerNode = this.player.getCurrentNode();

    let controlNodes = this.mapData.getControlNodes();
    this.gameState.controlNodes = controlNodes;

    this.observers.update(this.gameState);
  }

  move(x, y) {
    this.player.move(x, y);
    this.gameState.playerNode = this.player.getCurrentNode();

    if (
      this.player.getCurrentNode() ===
      this.mapData.getControlNodes()[parseInt(this.takenControls) + 1]
    ) {
      this.takenControls += 1;

      if (
        this.takenControls ===
        Object.keys(this.mapData.getControlNodes()).length
      ) {
        this.gameState.completed = true;
        this.gameState.shortestPath = this.mapData.calculateShortest();
        this.gameState.playerPath = this.player.getPath();
        this.playerController.disableWalk();
      }
    }

    this.observers.update(this.gameState);
  }
}

export default GameMode;
