class RandomCourse {
  constructor(graph, width, height) {
    this.width = width;
    this.height = height;
    this.graph = graph;
    this.currentControlNode = 1; //startId
    this.controls = [];
  }

  buildCourse(startId, courseDifficulty, controlAmount) {
    const legList = this.courseSpecifications(courseDifficulty, controlAmount); // generate list of legs
    for (let i = 0; i < legList.length; i++) {
      let control = this.buildLeg(this.currentControlNode, legList[i]);
      this.currentControlNode = control.id;
      this.controls.push(control);
    }
    return this.controls;
  }

  buildLeg(currentControlNode, legDifficulty) {
    if (legDifficulty == "e") {
      return this.findValidControlNodes(currentControlNode, 5, 10, 0, 1);
    }

    if (legDifficulty == "m") {
      let control = this.findValidControlNodes(
        currentControlNode,
        10,
        20,
        1,
        2
      );
      return control;
      //placera control på randomiserad nod som möter kriterier
    }

    if (legDifficulty == "h") {
      let control = this.findValidControlNodes(
        currentControlNode,
        15,
        100,
        2,
        4
      );
      return control;
      //placera control på randomiserad nod som möter kriterier
    }
  }

  // a list of valid controls according to leg-criterea will be returned
  // risk of high complexiy
  findValidControlNodes(
    startNode,
    minJumps,
    maxJumps,
    minFloorChanges,
    maxFloorChanges
  ) {
    const distances = {};
    const visited = new Set();
    const priorityQueue = new Map();
    let random = 0;
    let control = null;

    // Initialize distances and priority queue
    for (const nodeId in this.graph.adjacencyList) {
      if (nodeId == startNode) {
        distances[nodeId] = { cost: 0, stairs: 0, jumps: 0 };
      } else {
        distances[nodeId] = {
          cost: Infinity,
          stairs: Infinity,
          jumps: Infinity,
        };
      }
      priorityQueue.set(nodeId, distances[nodeId].cost);
    }

    //Calculation to gain better coverage.
    let xy = this.coverage();

    while (priorityQueue.size > 0) {
      const currentNodeId = Array.from(priorityQueue.keys()).reduce((a, b) =>
        priorityQueue.get(a) < priorityQueue.get(b) ? a : b
      );

      const currentNode = this.graph.adjacencyList[currentNodeId];
      const currentDistance = priorityQueue.get(currentNodeId);

      const alreadyAControl = this.controls.some(
        (node) => node.id == currentNodeId
      );
      let tooClose = false;
      let distance = 0;
      for (let control of this.controls) {
        let controlNode = this.graph.getNode(control.id);
        distance = this.distance(currentNode.node, controlNode.node);

        if (distance <= 30) {
          tooClose = true;
        }
      }

      visited.add(currentNodeId);
      if (
        distances[currentNodeId].stairs >= minFloorChanges &&
        distances[currentNodeId].jumps >= minJumps &&
        distances[currentNodeId].stairs <= maxFloorChanges &&
        distances[currentNodeId].jumps <= maxJumps &&
        currentNodeId != 1 &&
        !alreadyAControl &&
        !tooClose
      ) {
        if ((xy[0] === 0 && xy[1] === 0) || control === null) {
          // No controls placed
          if (control === null) {
            control = currentNode.node;
          } else {
            random = Math.random();
            if (random < 0.1) {
              control = currentNode.node;
            }
          }
        } else {
          if (xy[0] >= 0.5 && xy[1] >= 0.5) {
            // Current controls are mostly in top-left

            if (xy[0] > xy[1]) {
              // If x is greater than y, give precedence to x

              if (control.posX >= currentNode.node.posX) {
                random = Math.random();
                if (random < 0.1) {
                  control = currentNode.node;
                }
              }
            } else {
              // Give precedence to y

              if (control.posY >= currentNode.node.posY) {
                random = Math.random();
                if (random < 0.1) {
                  control = currentNode.node;
                }
              }
            }
          }

          if (xy[0] <= 0.5 && xy[1] <= 0.5) {
            // Current controls are mostly in the lower-left

            if (xy[0] < xy[1]) {
              // If x is lesser than y, give precedence to x because its the most contributing factor to "drag" the coverage to the bottom left.

              if (control.posX <= currentNode.node.posX) {
                random = Math.random();
                if (random < 0.1) {
                  control = currentNode.node;
                }
              }
            } else {
              if (control.posY <= currentNode.node.posY) {
                random = Math.random();
                if (random < 0.1) {
                  control = currentNode.node;
                }
              }
            }
          }

          if (xy[0] >= 0.5 && xy[1] <= 0.5) {
            // Current controls are mostly in the bottom-right

            if (xy[0] - 0.5 > Math.abs(xy[1] - 0.5)) {
              if (control.posX > currentNode.node.posX) {
                random = Math.random();
                if (random < 0.1) {
                  control = currentNode.node;
                }
              }
            } else {
              if (control.posY < currentNode.node.posY) {
                random = Math.random();
                if (random < 0.1) {
                  control = currentNode.node;
                }
              }
            }
          }

          if (xy[0] <= 0.5 && xy[1] >= 0.5) {
            // Current controls are mostly in hte top-left

            if (Math.abs(xy[0] - 0.5) > xy[1] - 0.5) {
              if (control.posX < currentNode.node.posX) {
                random = Math.random();
                if (random < 0.1) {
                  control = currentNode.node;
                }
              }
            } else {
              if (control.posY > currentNode.node.posY) {
                random = Math.random();
                if (random < 0.1) {
                  control = currentNode.node;
                }
              }
            }
          }
        }

        // candidates.push(this.graph.getNode(currentNodeId));
      }
      priorityQueue.delete(currentNodeId);

      for (const neighbourId in currentNode.edges) {
        if (visited.has(neighbourId)) {
          continue;
        }
        const neighbour = currentNode.edges[neighbourId];
        const distanceToNeighbour = currentDistance + neighbour.weight;
        let stairsToNeighbour = distances[currentNodeId].stairs;
        const jumpsToNeighbour = distances[currentNodeId].jumps + 1;

        if (
          currentNode.edges[neighbourId].stair.stairCase !== undefined &&
          currentNode.edges[neighbourId].stair.stairCase !== null
        ) {
          stairsToNeighbour++;
        }
        if (
          stairsToNeighbour > maxFloorChanges ||
          jumpsToNeighbour > maxJumps
        ) {
          continue;
        }

        if (distanceToNeighbour < distances[neighbourId].cost) {
          distances[neighbourId] = {
            cost: distanceToNeighbour,
            stairs: stairsToNeighbour,
            jumps: jumpsToNeighbour,
          };
          priorityQueue.set(neighbourId, distanceToNeighbour);
        }
      }
    }
    if (control === null) {
      window.location.href = "/index.html";
      alert(
        "Error when constructing the course. Most likely that the program didn't find a valid control node. Try decreasing the amount of controls or try again."
      );
    }
    return control;
  }

  coverage() {
    let x = 0;
    let y = 0;

    if (this.controls.length === 0) {
      return [x, y];
    }

    for (const control of this.controls) {
      x += control.posX;
      y += control.posY;
    }

    x = x / (this.controls.length * this.width);
    y = y / (this.controls.length * this.height);

    return [x, y];
  }

  distance(node1, node2) {
    let dx = node1.posX - node2.posX;
    let dy = node1.posY - node2.posY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  checkIfBest(candidate) {
    let coverage = 0;

    for (const control of Object.values(this.controls)) {
      let controlNode = this.graph.getNode(control).node;

      let distance = this.distance(candidate, controlNode);

      coverage += 1 / distance;
    }
    return coverage;
  }

  ///// ----------------- LOVISAS HÄR UNDER ---------------------/////

  //shuffle the order of elements
  shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  //choose number of controls and their difficulty.
  courseSpecifications(difficulty, controlNumber) {
    let controls = [];

    //the percentage of each type of difficulty
    if (difficulty == "Hard") {
      var hardControls = Math.round(controlNumber * 0.4);
      var mediumControls = Math.round(controlNumber * 0.3);
      var easyControls = Math.round(controlNumber * 0.3);
    }

    if (difficulty == "Medium") {
      var hardControls = Math.round(controlNumber * 0);
      var mediumControls = Math.round(controlNumber * 0.6);
      var easyControls = Math.round(controlNumber * 0.4);
    }

    if (difficulty == "Easy") {
      var hardControls = Math.round(controlNumber * 0);
      var mediumControls = Math.round(controlNumber * 0);
      var easyControls = Math.round(controlNumber * 1);
    }

    var totalControls = hardControls + mediumControls + easyControls;

    //to make sure the number of controls is exactly what the user inputs
    if (totalControls !== controlNumber) {
      let diff = Math.abs(totalControls - controlNumber);

      if (totalControls < controlNumber) {
        easyControls += diff;
      } else {
        if (hardControls > 0) {
          mediumControls -= diff;
        } else {
          easyControls -= diff;
        }
      }
    }

    //loops that put a letter in the list for the type of control it is
    for (let i = 0; i < hardControls; i++) {
      controls.push("h");
    }
    for (let i = 0; i < mediumControls; i++) {
      controls.push("m");
    }
    for (let i = 0; i < easyControls; i++) {
      controls.push("e");
    }

    return this.shuffleArray(controls);
  }
}
//to be able to use it is html file (?)
export default RandomCourse;
