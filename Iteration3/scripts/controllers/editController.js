class EditController {
  constructor(game, view) {
    this.game = game;
    this.view = view;

    this.currentFloor = 0;
    this.settingStair = false;
    this.canvas = this.view.canvas;

    this.save = this.view.save;
    this.quit = this.view.quit;
    this.popupSave = this.view.popupSave;
    this.popupResolver = null;

    this.save.addEventListener("click", this.handleSave.bind(this));
    this.quit.addEventListener("click", this.goToHomePage.bind(this));

    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseup.bind(this));
    this.canvas.addEventListener(
      "contextmenu",
      this.handleMouseDown.bind(this)
    );

    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    this.popupSaveClicked = new Promise((resolve) => {
      this.popupResolver = resolve;
    });

    this.manual = view.manual;
    this.manual.addEventListener("click", this.openInstructions.bind(this));
  }

  openInstructions() {
    window.open("/Iteration3/menudesign/InstructionsManual/instructions.html", "_blank");
  }

  handleKeyDown(event) {
    if (event.key === "+") {
      this.currentFloor += 1;
    } else if (event.key === "-") {
      this.currentFloor -= 1;
    }
    this.view.updateNumber(this.currentFloor);
  }

  // Handle the event of the user clicking "show shortest path button"
  handleShortest() {
    const path = this.mapData.calculateShortest();
    this.view.showShortest(path);
  }

  //Handle the event of the user clicking the "save" button.
  // This will saved the currently displayed graph.
  // This is more of a tool to easily create a standard graph for
  // multiple different images.
  handleSave() {
    this.game.handleSave();
  }

  // Fires when the user pushes down the mouse button.
  handleMouseDown(event) {
    event.preventDefault();
    if (this.settingStair) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    this.mouseDownX = event.clientX - rect.left - 5;
    this.mouseDownY = event.clientY - rect.top - 5;
  }

  // Fires when the user realeases the mouse button.
  // It keeps track of the distance that the user has
  // moved the mouse when pushing it down.
  // The distance will determin if the user wants to
  // create a node or an edge between two nodes.
  handleMouseup(event) {
    event.preventDefault();
    if (this.settingStair) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const mouseUpX = event.clientX - rect.left - 5;
    const mouseUpY = event.clientY - rect.top - 5;
    const oneDirectional = event.shiftKey;
    const distance = Math.sqrt(
      (this.mouseDownX - mouseUpX) ** 2 + (this.mouseDownY - mouseUpY) ** 2
    );

    // If the user has barely moved the mouse, then we create a node.
    if (distance < 2) {
      this.game.addNode(mouseUpX, mouseUpY, this.currentFloor);

      // Otherwise, we will create an edge.
      // To determine which nodes we will use the findNodeAtPosition() function.
    } else {
      if (event.button === 2) {
        this.settingStair = true;
        this.view.displayPopup();
        this.awaitStairandFloorSubmission(mouseUpX, mouseUpY, oneDirectional);
        this.awaitStairandFloorSubmission(mouseUpX, mouseUpY, oneDirectional);
      } else {
        this.game.addEdge(
          this.mouseDownX,
          this.mouseDownY,
          mouseUpX,
          mouseUpY,
          distance,
          null,
          oneDirectional
        );
      }
    }
  }

  async awaitStairandFloorSubmission(mouseUpX, mouseUpY, oneDirectional) {
    this.popupSave.addEventListener(
      "click",
      () => {
        const stairCase = document.getElementById("staircase").value;
        if (stairCase) {
          this.view.closePopup();
          this.game.addEdge(
            this.mouseDownX,
            this.mouseDownY,
            mouseUpX,
            mouseUpY,
            null,
            stairCase,
            oneDirectional,
            stairCase,
            oneDirectional
          );
          this.settingStair = false;
          this.view.closePopup();
        } else {
          console.error("Invalid input");
          this.settingStair = false;
        }
      },
      { once: true }
    );
  }

  // we find the node by checking if the user has pushed down/ realeased
  // the mouse inside the radius of any node in the graph.
  // The node radius = 10.
  // If no node is found, it will return null.

  goToHomePage() {
    this.game.goToHomePage();
  }
}

export default EditController;
