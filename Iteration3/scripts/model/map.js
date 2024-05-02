import Graph from "./graph.js";
import RandomCourse from "./randControlPlacement.js";

class MapData {
  constructor(image) {
    this.image = image;

    this.statGraph = new Graph();

    this.controls = {};
  }

  async loadJSON(jsonGraph) {
    return new Promise((resolve, reject) => {
      fetch(jsonGraph)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load the jsonGraph");
          }
          return response.json();
        })
        .then((jsonData) => {
          this.statGraph.adjacencyList = jsonData.adjacencyList;
          this.setControlsFromJSON();
          this.randomControlPlacement = new RandomCourse(this.statGraph);
          resolve();
        })
        .catch((error) => {
          console.log("Error loading the JSON-file: ", error);
          reject(error);
        });
    });
  }

  randomizeCourse(difficulty, nControl) {
    //TODO: Randomize the edges

    //this.statGraph = newGraph;

    // Randomize the controls in the courseGenerator.
    let randomControls = this.randomControlPlacement.buildCourse(
      1,
      difficulty,
      nControl
    );

    this.controls = randomControls;
  }

  setControlsFromJSON() {
    for (const [id, node] of Object.entries(this.statGraph.adjacencyList)) {
      if (node.node.control) {
        this.controls[id] = node.node.controlN;
      }
    }
  }

  findNodeAtPosition(x, y) {
    for (const [id, nodeData] of Object.entries(this.statGraph.adjacencyList)) {
      const node = nodeData.node;
      const distance = Math.sqrt((node.posX - x) ** 2 + (node.posY - y) ** 2);
      if (distance <= 5) {
        return node;
      }
    }
    return null;
  }

  addControl(nodeID, controlN) {
    if (this.statGraph.setToControl(nodeID, controlN)) {
      this.controls[nodeID] = controlN;
    }
  }

  addNode(id, x, y, floor) {
    this.statGraph.addNode(id, x, y, floor);
  }

  addEdge(
    startID,
    destID,
    distance,
    stairCase,
    newFloor,
    previousFloor,
    oneDirectional
  ) {
    this.statGraph.addEdge(
      startID,
      destID,
      distance,
      stairCase,
      newFloor,
      previousFloor,
      oneDirectional,
      previousFloor,
      oneDirectional
    );
  }

  calculateShortest() {
    const path = this.statGraph.findShortestPath(this.controls);

    return path;
  }

  getControls() {
    return this.controls;
  }
  getGraph() {
    return this.statGraph;
  }

  getControlNodes() {
    const nodes = {};
    Object.entries(this.controls).forEach(([nodeID, controlN]) => {
      nodes[controlN] = this.statGraph.getNode(nodeID);
    });

    return nodes;
  }

  getNode(nodeID) {
    return this.statGraph.getNode(nodeID);
  }
}

export default MapData;
