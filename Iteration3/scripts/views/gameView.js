const TRIANGLE_SIZE = 20;
const CONTROL_RADIUS = 15;

class GameView {
  constructor(game, width, height) {
    document.body.innerHTML = "";

    this.game = game;

    this.buttonContainer = document.createElement("div");
    this.buttonContainer.setAttribute("id", "button-container");

    // Create the quit button
    this.quit = document.createElement("button");
    this.quit.textContent = "Quit";
    this.quit.classList.add("quit");

    // init the canvas
    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.border = "5px solid black";
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "10%";
    this.canvas.style.left = "10%";
    this.ctx = this.canvas.getContext("2d");

    this.buttonContainer.appendChild(this.quit);
    document.body.appendChild(this.buttonContainer);

    // Append canvas to document body or any other container
    document.body.appendChild(this.canvas);

    this.game.subscribe(this.update.bind(this));
  }
  //Render the startNode as a triangle
  renderStartNode(startNode, angle, fstControl) {
    //this.ctx.arc(startNode.node.posX,startNode.node.posY)

    // Calculate the coordinates of the vertices relative to the start node's position
    const x = startNode.node.posX;
    const y = startNode.node.posY;
    const x1 = x + TRIANGLE_SIZE * Math.cos(angle);
    const y1 = y + TRIANGLE_SIZE * Math.sin(angle);
    const x2 = x + TRIANGLE_SIZE * Math.cos(angle + (2 * Math.PI) / 3);
    const y2 = y + TRIANGLE_SIZE * Math.sin(angle + (2 * Math.PI) / 3);
    const x3 = x + TRIANGLE_SIZE * Math.cos(angle + (4 * Math.PI) / 3);
    const y3 = y + TRIANGLE_SIZE * Math.sin(angle + (4 * Math.PI) / 3);

    // Draw the triangle
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.closePath();

    // Set the stroke style and draw the triangle outline
    this.ctx.strokeStyle = "purple";
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(
      fstControl.posX - CONTROL_RADIUS * Math.cos(angle),
      fstControl.posY - CONTROL_RADIUS * Math.sin(angle)
    );
    this.ctx.stroke();
    this.ctx.closePath();
  }

  //Rendering of the controlNodes.
  rendercontrolNodes(controlNodes) {
    for (let i = 0; i <= controlNodes.length; i++) {
      let node = controlNodes[i];
      this.ctx.beginPath();
      this.ctx.arc(node.posX, node.posY, CONTROL_RADIUS, 0, Math.PI * 2);

      this.ctx.strokeStyle = "purple";
      this.ctx.stroke();
      this.ctx.closePath();

      // Render control number
      this.ctx.fillStyle = "black";
      this.ctx.font = "12px Arial";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(i + 1, node.posX + 15, node.posY - 15);

      if (controlNodes[i + 1]) {
        let nextNode = controlNodes[i + 1];
        const angle = Math.atan2(
          nextNode.posY - node.posY,
          nextNode.posX - node.posX
        );

        // Set line color and width
        const startX = node.posX + CONTROL_RADIUS * Math.cos(angle);
        const startY = node.posY + CONTROL_RADIUS * Math.sin(angle);
        const endX = nextNode.posX - CONTROL_RADIUS * Math.cos(angle);
        const endY = nextNode.posY - CONTROL_RADIUS * Math.sin(angle);

        // Set line color and width
        this.ctx.strokeStyle = "purple";

        // Draw line between current control and next control
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.closePath();
      } else {
        // Render the extra circle for the last control node
        this.ctx.beginPath();
        this.ctx.arc(node.posX, node.posY, CONTROL_RADIUS - 3, 0, Math.PI * 2);

        this.ctx.strokeStyle = "purple";
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
    /*
    for (const [controlNum, node] of Object.entries(controlNodes)) {
      // Render control as a circle
      this.ctx.beginPath();
      this.ctx.arc(
        node.node.posX,
        node.node.posY,
        CONTROL_RADIUS,
        0,
        Math.PI * 2
      );

      this.ctx.strokeStyle = "purple";
      this.ctx.stroke();
      this.ctx.closePath();

      // Render control number
      this.ctx.fillStyle = "black";
      this.ctx.font = "12px Arial";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(controlNum, node.node.posX + 15, node.node.posY - 15);

      if (controlNodes[parseInt(controlNum) + 1]) {
        let nextNode = controlNodes[parseInt(controlNum) + 1].node;
        const angle = Math.atan2(
          nextNode.posY - node.node.posY,
          nextNode.posX - node.node.posX
        );

        // Set line color and width
        const startX = node.node.posX + CONTROL_RADIUS * Math.cos(angle);
        const startY = node.node.posY + CONTROL_RADIUS * Math.sin(angle);
        const endX = nextNode.posX - CONTROL_RADIUS * Math.cos(angle);
        const endY = nextNode.posY - CONTROL_RADIUS * Math.sin(angle);

        // Set line color and width
        this.ctx.strokeStyle = "purple";

        // Draw line between current control and next control
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.closePath();
      } else {
        // Render the extra circle for the last control node
        this.ctx.beginPath();
        this.ctx.arc(
          node.node.posX,
          node.node.posY,
          CONTROL_RADIUS - 3,
          0,
          Math.PI * 2
        );

        this.ctx.strokeStyle = "purple";
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }*/
  }

  calculateAngle(startNode, fstControl) {
    const deltaX = fstControl.posX - startNode.node.posX;
    const deltaY = fstControl.posY - startNode.node.posY;

    // Calculate the angle using atan2
    const angle = Math.atan2(deltaY, deltaX);

    // Ensure the angle is in the range [0, 2*PI)
    return angle >= 0 ? angle : angle + 2 * Math.PI;
  }
  renderPlayerPath(path, coloredPlayerPaths) {
    for (const [order, node] of Object.entries(path)) {
      if (path[parseInt(order) + 1]) {
        let skip = false;
        let nextNode = path[parseInt(order) + 1].node;
        for (let i = 0; i < coloredPlayerPaths.length; i++) {
          if (
            (coloredPlayerPaths[i][0].node === node.node &&
              coloredPlayerPaths[i][1].node === nextNode) ||
            (coloredPlayerPaths[i][0].node === nextNode &&
              coloredPlayerPaths[i][1].node === node.node)
          ) {
            skip = true;
          }

          if (node.edges[nextNode.id].stair.stairCase !== undefined) {
            skip = true;
          }
        }
        if (!skip) {
          this.ctx.beginPath();
          this.ctx.moveTo(node.node.posX, node.node.posY);
          this.ctx.lineTo(nextNode.posX, nextNode.posY);
          this.ctx.strokeStyle = "red";
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    }
  }

  renderShortestPath(path, playerPath) {
    let coloredPlayerPaths = [];
    for (const [order, node] of Object.entries(path)) {
      if (path[parseInt(order) + 1]) {
        let nextNode = path[parseInt(order) + 1];

        if (path[order].edges[nextNode.node.id].stair.stairCase !== undefined) {
          continue;
        }

        let color = "blue";
        for (const [playerOrder, playerPathNode] of Object.entries(
          playerPath
        )) {
          if (playerPath[parseInt(playerOrder) + 1]) {
            let nextPlayerPathNode = playerPath[parseInt(playerOrder) + 1];

            if (
              (node === playerPathNode && nextNode === nextPlayerPathNode) ||
              (node === nextPlayerPathNode && nextNode === playerPathNode)
            ) {
              color = "green";
              coloredPlayerPaths.push([playerPathNode, nextPlayerPathNode]);
            }
          }
        }

        this.ctx.beginPath();
        this.ctx.moveTo(node.node.posX, node.node.posY);
        this.ctx.lineTo(nextNode.node.posX, nextNode.node.posY);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }

    this.renderPlayerPath(playerPath, coloredPlayerPaths);
  }

  renderShortestAtStart(path) {
    for (const [order, node] of Object.entries(path)) {
      if (path[parseInt(order) + 1]) {
        let nextNode = path[parseInt(order) + 1].node;
        if (path[order].edges[nextNode.id].stair.stairCase !== undefined) {
          continue;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(node.node.posX, node.node.posY);
        this.ctx.lineTo(nextNode.posX, nextNode.posY);
        this.ctx.strokeStyle = "blue";
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }

  // update function which is called from the observerable.
  update({
    startNode,
    playerNode,
    image,
    controlNodes,
    completed,
    shortestPath,
    playerPath,
  }) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

    let angle = this.calculateAngle(startNode, controlNodes[0]);

    this.renderStartNode(startNode, angle, controlNodes[0]);
    this.rendercontrolNodes(controlNodes);

    //   this.renderShortestAtStart(shortestPath);

    if (completed) {
      // this.renderpath(playerPath)
      this.renderShortestPath(shortestPath, playerPath);
    }
  }
}

export default GameView;
