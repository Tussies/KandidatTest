import Node from "./node.js";

class Graph {
  adjacencyList;
  constructor() {
    this.adjacencyList = {};
  }

  // Checks if the node is already present
  // if not it will be added with an empty edges list
  addNode(id, x, y, floor) {
    if (this.adjacencyList[id] == undefined) {
      const node = new Node(id, x, y, floor);
      this.adjacencyList[id] = {
        node,
        edges: {},
      };
    }
  }

  // First checks wether the start node exists or not.
  // Then, traverses the list of edges and checks if the
  //neighbour exists. If both exists, an edge from start node
  //to the neighbour node will be created.
  addEdge(
    startId,
    neighbourId,
    weight,
    stairCase,
    newFloor,
    previousFloor,
    oneDirectional
  ) {
    if (this.contains(startId) && this.contains(neighbourId)) {
      const neighNode = this.getNode(neighbourId).node;

      // Add the edge from startId to neighbourId
      this.adjacencyList[startId].edges[neighbourId] = {
        node: neighNode,
        weight,
        stair: { stairCase, newFloor },
        oneDirectional: oneDirectional,
      };

      // Log the edge object immediately after adding it
      console.log(this.adjacencyList[startId].edges[neighbourId]);

      // Add the reverse edge if it's not one-directional
      if (
        this.adjacencyList[neighbourId].edges[startId] === undefined &&
        oneDirectional == false
      ) {
        const startNode = this.getNode(startId).node;
        if (neighNode.floor > startNode.floor) {
          weight = 20;
        } else if (neighNode.floor < startNode.floor) {
          weight = 30;
        }
        this.adjacencyList[neighbourId].edges[startId] = {};
        this.adjacencyList[neighbourId].edges[startId] = {
          node: startNode,
          weight,
          stair: { stairCase, goToFloor: previousFloor },
          oneDirectional: oneDirectional,
        };
      }
    }
  }

  canReachAllNodes() {
    const visited = {};
    const nodes = Object.keys(this.adjacencyList);

    // Start DFS from each node
    for (const node of nodes) {
      // Initialize visited set for current DFS
      const currentVisited = {};
      this._dfs(node, currentVisited);

      // Merge current DFS's visited nodes into overall visited set
      Object.assign(visited, currentVisited);

      // If all nodes are visited, return true
      if (Object.keys(visited).length === nodes.length) {
        return true;
      }
    }

    // If not all nodes are visited, return false
    return false;
  }

  // Depth First Search (DFS)
  _dfs(nodeId, visited) {
    if (!visited[nodeId]) {
      visited[nodeId] = true;
      const edges = this.adjacencyList[nodeId].edges;
      for (const neighbourId in edges) {
        this._dfs(neighbourId, visited);
      }
    }
  }

  setToControl(nodeID, controlN) {
    if (this.adjacencyList[nodeID] !== undefined) {
      this.adjacencyList[nodeID].node.control = true;
      this.adjacencyList[nodeID].node.controlN = controlN;
      return true;
    }
    return false;
  }

  //Checks if the nodeId is a key in the adjacencyList
  contains(nodeId) {
    return this.adjacencyList[nodeId] != undefined;
  }

  moveToNode(currentNode, posX, posY) {
    let deltaX = null;
    let deltaY = null;
    let distance = Infinity;
    let newDistance = null;
    let nextNode = null;

    for (const neighbour of Object.values(currentNode.edges)) {
      deltaX = neighbour.node.posX - posX;
      deltaY = neighbour.node.posY - posY;
      newDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (newDistance > 15) {
        continue;
      }

      if (newDistance <= distance) {
        distance = newDistance;
        nextNode = neighbour;
      }
    }
    if (nextNode !== null) {
      let newNode = this.getNode(nextNode.node.id);
      return newNode;
    }
    return null;
  }

  // Finds the shortest between two nodes.
  // The two nodes will either be one start node of the course or
  // a control node.
  findSegment(startId, destId) {
    let distances = {};
    let prev = {};
    let visited = new Set();
    let pq = [];

    for (const [id, node] of Object.entries(this.adjacencyList)) {
      distances[node.node.id] = node.node.id === startId ? 0 : Infinity;
      pq.push({ id: node.node.id, dist: distances[node.node.id] });
      prev[node.node.id] = null;
    }

    pq.sort((a, b) => a.dist - b.dist);

    while (pq.length !== 0) {
      let { id } = pq.shift(); //Get the node with the smallest distance
      visited.add(id);

      let node = this.getNode(id);

      if (id === destId) break;
      for (const neighbour of Object.values(node.edges)) {
        let alt = distances[node.node.id] + neighbour.weight;

        if (alt < distances[neighbour.node.id]) {
          distances[neighbour.node.id] = alt;
          prev[neighbour.node.id] = node.node.id;
          pq.push({ id: neighbour.node.id, dist: alt });
          pq.sort((a, b) => a.dist - b.dist);
        }
      }
    }

    //Reconstruct the path from start to end

    let path = [];
    for (let at = destId; at !== null; at = prev[at]) {
      let node = this.getNode(at);
      path.push(node);
    }
    path.reverse();

    return path.length > 0 ? path : null;
  }

  // Finds the shortest path from the start node of the course to
  // all the control nodes.
  findShortestPath(controls) {
    let startNodeId = this.adjacencyList[1].node.id;
    let path = [startNodeId];
    let currentStart = startNodeId;

    let controlList = Object.entries(controls);
    controlList.sort((a, b) => a[1] - b[1]);

    let sortedControls = Object.fromEntries(controlList);

    for (const [id, controlnumber] of Object.entries(sortedControls)) {
      const numericId = parseInt(id);
      let segment = this.findSegment(currentStart, numericId);
      if (segment) {
        if (segment.length === 1) {
          path = path.concat(segment);
        } else {
          path = path.concat(segment.slice(1));
        }
        currentStart = numericId;
      }
    }

    path[parseInt(0)] = this.getNode(startNodeId);
    return path;
  }

  //returns the edges list of the node with nodeId
  getNeighbours(nodeId) {
    return this.adjacencyList[nodeId].edges;
  }

  //returns the weight between two nodes.
  getWeight(startId, destId) {
    return this.adjacencyList[startId].edges[destId].weight;
  }

  //returns the node in the form of: {node : {posX : ... , posY : ... , ...} , edges : {id1 : {posX : ... , ...} , ... , idn : {posX : ..., ...}}}
  // If you only want the node and not the edges you should
  // call the function like: node = getNode(id).node
  getNode(nodeId) {
    return this.adjacencyList[nodeId];
  }

  // Returns the order of the graph/ how many nodes there are.
  getOrder() {
    return Object.keys(this.adjacencyList).length;
  }
}

export default Graph;
