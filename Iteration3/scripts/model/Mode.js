import MapData from "./map.js";
import Observable from "./observers.js";

class Mode {
  constructor(image) {
    this.mapData = new MapData(image);
    this.observers = new Observable();
  }

  goToHomePage() {
    window.location.href = "/index.html";
  }

  // Method to subscribe observers
  subscribe(observer) {
    this.observers.subscribe(observer);
  }

  // Method to unsubscribe observers
  unsubscribe(observer) {
    this.observers.unsubscribe(observer);
  }
}

export default Mode;
