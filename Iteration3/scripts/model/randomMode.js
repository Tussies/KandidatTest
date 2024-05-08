import GameMode from "./gameMode.js";
import Player from "./player.js";

class RandomMode extends GameMode {
  constructor(image, jsongraph, difficulty, numberControls) {
    super(image, jsongraph);

    this.difficulty = difficulty;
    this.numberControls = numberControls;
  }

  async initCourse() {
    await this.mapData.loadJSON(this.jsonGraph);

    //Randomize the edges and the controls.
    this.mapData.randomizeCourse(this.difficulty, this.numberControls);

    this.player = new Player(this.mapData.getGraph());

    this.gameState.startNode = this.mapData.getNode(1);
    this.gameState.playerNode = this.player.getCurrentNode();

    let controlNodes = this.mapData.getControls();
    this.gameState.controlNodes = controlNodes;

    this.observers.update(this.gameState);
  }
}

export default RandomMode;
