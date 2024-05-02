import Graph from "./graph.js";

class RandomCourse {
  constructor(graph) {
    this.graph = graph;
    this.currentControlNode = 1; //startId
    this.controls = {};
  }

  buildCourse(startId, courseDifficulty, controlAmount) {
    const legList = this.courseSpecifications(courseDifficulty, controlAmount); // generate list of legs
    let controlN = 1;
    for (let i = 0; i < legList.length; i++) {
      let control = this.buildLeg(this.currentControlNode, legList[i]).id;
      this.currentControlNode = control;
      this.controls[this.currentControlNode] = controlN;
      controlN += 1;
    }
    /* for(const [id,controlN] of Object.entries(this.controls)) {
        reformattedControls[controlN] = id
    }*/
    return this.controls;
  }

  buildLeg(currentControlNode, legDifficulty) {
    if (legDifficulty == "e") {
      let control = this.findValidControlNodes(currentControlNode, 5, 15, 0, 1);
      return control;
    }

    if (legDifficulty == "m") {
      let control = this.findValidControlNodes(
        currentControlNode,
        10,
        40,
        1,
        2
      );
      return control;
      //placera control på randomiserad nod som möter kriterier
    }

    if (legDifficulty == "h") {
      let control = this.findValidControlNodes(
        currentControlNode,
        20,
        4000,
        2,
        4
      );
      return control;
      //placera control på randomiserad nod som möter kriterier
    }
  }

  // a list of valid controls according to leg-criterea will be returned
  // risque of high complexiy
  findValidControlNodes(
    startNode,
    minDistance,
    maxDistance,
    minFloorChanges,
    maxFloorChanges
  ) {
    const validControlNodes = [];
    let latestStairCase = null;
    let floorChangeCounter = 0;
    let control = null;

    let randomId = Math.floor(Math.random() * this.graph.getOrder()) + 1;
    if (this.controls.hasOwnProperty(randomId)) {
      control = this.findValidControlNodes(
        startNode,
        minDistance,
        maxDistance,
        minFloorChanges,
        maxFloorChanges
      );
      return control;
    }
    if (randomId === 1) {
      control = this.findValidControlNodes(
        startNode,
        minDistance,
        maxDistance,
        minFloorChanges,
        maxFloorChanges
      );
      return control;
    }

    for (const id in this.controls) {
      let nodeEdges = this.graph.adjacencyList[id].edges;

      if (nodeEdges.hasOwnProperty(randomId)) {
        control = this.findValidControlNodes(
          startNode,
          minDistance,
          maxDistance,
          minFloorChanges,
          maxFloorChanges
        );
        return control;
      }
    }

    let shortestPath = this.graph.findSegment(startNode, randomId);

    if (shortestPath && shortestPath.length > 1) {
      // hur funkar shortestpath leg?
      let distanceToNode = shortestPath.length;
      if (distanceToNode >= minDistance && distanceToNode <= maxDistance) {
        for (let i = 0; i < distanceToNode; i++) {
          if (shortestPath[i + 1]) {
            let nextNode = shortestPath[i + 1].node;
            if (
              shortestPath[i].edges[parseInt(nextNode.id)].stair.stairCase !==
              undefined
            ) {
              if (
                shortestPath[i].edges[parseInt(nextNode.id)].stair.stairCase !==
                latestStairCase
              ) {
                latestStairCase =
                  shortestPath[i].edges[parseInt(nextNode.id)].stair.stairCase;

                floorChangeCounter += 1;
              }
            }
          }
        }
        //distance criteria
        if (
          floorChangeCounter >= minFloorChanges &&
          floorChangeCounter <= maxFloorChanges
        ) {
          control = shortestPath[shortestPath.length - 1].node;
          return control;
        } else {
          control = this.findValidControlNodes(
            startNode,
            minDistance,
            maxDistance,
            minFloorChanges,
            maxFloorChanges
          );
          return control;
        }
      } else {
        control = this.findValidControlNodes(
          startNode,
          minDistance,
          maxDistance,
          minFloorChanges,
          maxFloorChanges
        );
        return control;
      }

      // more code for floorchanges needed here
    } else {
      control = this.findValidControlNodes(
        startNode,
        minDistance,
        maxDistance,
        minFloorChanges,
        maxFloorChanges
      );
      return control;
    }

    /*
    for (let nodeId = 1; nodeId <= this.graph.getOrder(); nodeId++) {
      let latestStairCase = null;
      let floorChangeCounter = 0;
      if (nodeId !== 1) {
        const shortestPath = this.graph.findSegment(startNode, nodeId);

        if (shortestPath && shortestPath.length > 1) {
          // hur funkar shortestpath leg?
          let distanceToNode = shortestPath.length;
          if (distanceToNode >= minDistance && distanceToNode <= maxDistance) {
            for (let i = 0; i < distanceToNode; i++) {
              if (shortestPath[i + 1]) {
                let nextNode = shortestPath[i + 1].node;
                if (this.graph.adjacencyList[shortestPath[i].node.id].edges[parseInt(nextNode.id)].stair.stairCase !== undefined) {
                  if (
                    this.graph.adjacencyList[shortestPath[i].node.id].edges[parseInt(nextNode.id)]
                      .stair.stairCase !== latestStairCase
                  ) {
                    latestStairCase =
                      this.graph.adjacencyList[shortestPath[i].node.id].edges[parseInt(nextNode.id)]
                        .stair.stairCase;

                    floorChangeCounter += 1;
                  }
                }
              }
            }
            //distance criteria
            if (
              floorChangeCounter >= minFloorChanges &&
              floorChangeCounter <= maxFloorChanges
            ) {
              validControlNodes.push({
                node: shortestPath[shortestPath.length - 1].node,
                distance: distanceToNode,
              });
            }
          }

          // more code for floorchanges needed here
        }
      }
    }*/

    return validControlNodes;
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
