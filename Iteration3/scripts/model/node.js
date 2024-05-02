class Node {
  constructor(id, posX, posY, floor) {
    this.id = id;
    this.posX = posX;
    this.posY = posY;
    this.control = false;
    this.controlN = null;
    this.floor = floor;
  }
}

export default Node;
