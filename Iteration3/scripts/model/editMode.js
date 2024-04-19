import EditController from "../controllers/editController.js";
import EditView from "../views/editView.js";
import Mode from "./Mode.js";

class EditMode extends Mode {
  constructor(image) {
    super();

    this.width = image.naturalWidth;
    this.height = image.naturalHeight;

    if (image.naturalWidth > document.documentElement.clientWidth) {
      this.width = image.naturalWidth;
      //this.width = document.documentElement.clientWidth - 200;
    }

    if (image.naturalHeight > document.documentElement.clientHeight) {
      this.height = image.naturalHeight;
      //this.height = document.documentElement.clientHeight - 200;
    }

    this.view = new EditView(this, this.width, this.height);
    this.controller = new EditController(this, this.view);
    this.nodeID = 1;
    this.controlN = 1;

    this.state = {
      graph: this.mapData.getGraph(),
      image: image,
      controlNodes: this.mapData.getControls(),
    };

    this.observers.update(this.state);
  }

  handleSave() {
    // Get the graph data
    const graphData = this.mapData.getGraph();

    // Convert the graph data to JSON format
    const jsonData = JSON.stringify(graphData, (key, value) => {
      // If the value is an object and has a property called 'oneDirectional',
      // convert it to a boolean to ensure it's serialized properly
      if (typeof value === "object" && "oneDirectional" in value) {
        return { ...value, oneDirectional: Boolean(value.oneDirectional) };
      }
      return value;
    });

    // Create a Blob object from the JSON data
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "graph_data.json";

    // Simulate a click event to trigger the download
    link.click();

    // Revoke the URL to release the resources
    URL.revokeObjectURL(url);
  }

  addNode(x, y) {
    let nodeAtPos = this.mapData.findNodeAtPosition(x, y);

    //If there is a node at the position, we will make it a control
    if (nodeAtPos !== null) {
      this.mapData.addControl(nodeAtPos.id, this.controlN);
      this.controlN += 1;

      // Otherwise we just create a new node
    } else {
      this.mapData.addNode(this.nodeID, x, y);
      this.nodeID++;
    }

    this.observers.update(this.state);
  }

  addEdge(startX, startY, destX, destY, distance, oneDirectional) {
    const startNode = this.mapData.findNodeAtPosition(startX, startY);
    const destNode = this.mapData.findNodeAtPosition(destX, destY);
    if (startNode && destNode !== startNode) {
      this.mapData.addEdge(startNode.id, destNode.id, distance, oneDirectional);
    }
    console.log(this.mapData.getGraph());
    this.observers.update(this.state);
  }
}

export default EditMode;
