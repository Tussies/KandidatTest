const NODE_RADIUS = 5;

class EditView {
  constructor(game, width, height) {
    document.body.innerHTML = "";

    this.game = game;
    this.width = width;
    this.height = height;

    this.floorNumber = document.createElement("div");
    this.floorNumber.classList.add("floor-number");
    this.floorNumber.textContent = `Floor: ${0}`;
    document.body.appendChild(this.floorNumber);

    this.quit = document.createElement("button");
    this.quit.textContent = "Quit";
    this.quit.setAttribute("id","quit")

    this.sidebar = document.createElement("div");
    this.sidebar.classList.add("sidebar");
    this.sidebar.appendChild(this.quit);

  
    // Create the save button
    this.save = document.createElement("button");
    this.save.textContent = "Save";
    this.save.classList.add("save");

    this.sidebar.appendChild(this.quit);
    this.sidebar.appendChild(this.save);


  
    // init the canvas
    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.border = "5px solid black";
    this.canvas.style.position = "relative";
    this.canvas.style.top = "10%";
    this.canvas.style.left = "23%";
    this.ctx = this.canvas.getContext("2d");

    // Initializing the popup
    this.popup = document.createElement("div");
    this.popup.setAttribute("id", "popup");
    this.popup.classList.add("popup");

    this.inputStair = document.createElement("div");
    this.inputStair.classList.add("inputField");
    this.inputStair.innerHTML = `<label for="staircase">StairCase:</label> <input type="text" id="staircase" name="staircase">`;

    this.popupSave = document.createElement("button");
    this.popupSave.innerHTML = ` <button>Submit</button>`;

    this.popup.appendChild(this.inputStair);
    this.popup.appendChild(this.popupSave);

    // Append the popup and the canvas to document body
    document.body.appendChild(this.popup);
    document.body.appendChild(this.canvas);
    document.body.appendChild(this.sidebar)

    this.game.subscribe(this.update.bind(this));
  }

  updateNumber(floor) {
    this.floorNumber.textContent = `Floor: ${floor}`;
  }

  // Draw the given node onto the canvas.
  drawNode(node, controls) {
    // Draw the node as a purple circle
    this.ctx.beginPath();
    this.ctx.arc(node.posX, node.posY, NODE_RADIUS, 0, Math.PI * 2);

    this.ctx.fillStyle = "purple";
    this.ctx.fill();
    this.ctx.closePath();

    // Draw the number text in white color
    if (node.id in controls) {
      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.font = "12px Arial";
      this.ctx.fillText(controls[node.id], node.posX, node.posY);
    }
  }

  // Draw the edge between src and dest node with the given color and arrow
  drawEdge(srcX, srcY, destX, destY, weight, color) {
    const angle = Math.atan2(destY - srcY, destX - srcX);

    // Calculate the starting point on the perimeter of the start node
    const startX = srcX + NODE_RADIUS * Math.cos(angle);
    const startY = srcY + NODE_RADIUS * Math.sin(angle);

    // Calculate the ending point on the perimeter of the end node
    const endX = destX - NODE_RADIUS * Math.cos(angle);
    const endY = destY - NODE_RADIUS * Math.sin(angle);

    // Draw the edge line
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();

    // Draw arrow
    const arrowLength = 10; // Length of the arrow
    const arrowAngle = Math.PI / 4; // Angle of the arrow
    const arrowStartX = endX - arrowLength * Math.cos(angle - arrowAngle);
    const arrowStartY = endY - arrowLength * Math.sin(angle - arrowAngle);
    const arrowEndX = endX - arrowLength * Math.cos(angle + arrowAngle);
    const arrowEndY = endY - arrowLength * Math.sin(angle + arrowAngle);

    this.ctx.beginPath();
    this.ctx.moveTo(endX, endY);
    this.ctx.lineTo(arrowStartX, arrowStartY);
    this.ctx.moveTo(endX, endY);
    this.ctx.lineTo(arrowEndX, arrowEndY);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();

    // Display the weight
    const textX = (startX + endX) / 2;
    const textY = (startY + endY) / 2;
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "10px Arial";
    this.ctx.fillText(weight, textX, textY);
  }

  //This will display the popup
  displayPopup() {
    this.popup.style.display = "block";
  }

  savePopup() {
    // Handle saving popup data
    const staircaseInput = document.getElementById("staircase").value;
    const floorInput = document.getElementById("floor").value;
    console.log("Staircase:", staircaseInput);
    console.log("Floor:", floorInput);
    // You can perform further processing or send this data to your backend
    // After handling the submission, you can close the popup
    //this.closePopup();
  }

  closePopup() {
    // Hide the popup
    this.popup.style.display = "none";
  }

  update({ graph, image, controlNodes }) {
    const self = this;
    if (image.complete) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      self.ctx.drawImage(image, 0, 0, this.width, this.height);

      for (const [id, node] of Object.entries(graph.adjacencyList)) {
        this.drawNode(node.node, controlNodes);
      }

      for (const startNode of Object.values(graph.adjacencyList)) {
        for (const neighbour of Object.values(startNode.edges)) {
          this.drawEdge(
            startNode.node.posX,
            startNode.node.posY,
            neighbour.node.posX,
            neighbour.node.posY,
            graph.getWeight(startNode.node.id, neighbour.node.id),
            "purple"
          );
        }
      }
    }
  }
}

export default EditView;
