const NODE_RADIUS = 5;

class PlayerView {
  constructor(game) {
    this.game = game;

    // Make the view an observer of the game.
    this.game.subscribe(this.update.bind(this));

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  renderPlayer(playerNode) {
    this.ctx.fillStyle = "blue";

    this.ctx.beginPath();
    this.ctx.moveTo(playerNode.node.posX, playerNode.node.posY);
    this.ctx.arc(
      playerNode.node.posX,
      playerNode.node.posY,
      NODE_RADIUS,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  renderNeighbours(playerNode) {
    for (const neighbour of Object.values(playerNode.edges)) {
      this.ctx.strokeStyle = "blue";
      this.ctx.lineWidth = 3;

      this.ctx.beginPath();
      this.ctx.arc(
        neighbour.node.posX,
        neighbour.node.posY,
        NODE_RADIUS,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
      this.ctx.closePath();

      this.ctx.lineWidth = 1;

      // this.ctx.beginPath();
      // this.ctx.arc(playerNode.edges[neighbour.node.id].weight);
      // this.ctx.stroke();
      // this.ctx.closePath();
    }
  }

  update({
    startNode,
    playerNode,
    image,
    controlNodes,
    completed,
    shortestPath,
    playerPath,
  }) {
    if(!completed){
      this.renderNeighbours(playerNode);
      this.renderPlayer(playerNode);
    }
    
  }
}

export default PlayerView;
