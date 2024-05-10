import Graph from '../Iteration3/scripts/model/graph.js';

describe('Graph', () => {
  describe('addEdge', () => {
    it('should add an edge between two nodes', () => {
      const graph = new Graph();
      const startNodeId = 5;
      const neighbourNodeId = 3;
      const weight = 15;
      const stairCase = true;
      const newFloor = 2;
      const previousFloor = 1;
      const oneDirectional = false;

      graph.addNode(startNodeId, 0, 0, 5);
      graph.addNode(neighbourNodeId, 10, 10, 3);
      graph.addEdge(startNodeId, neighbourNodeId, weight, stairCase, newFloor, previousFloor, oneDirectional);

      expect(graph.adjacencyList[startNodeId].edges[neighbourNodeId]).toBeDefined();
      expect(graph.adjacencyList[startNodeId].edges[neighbourNodeId].weight).toBe(weight);
      expect(graph.adjacencyList[startNodeId].edges[neighbourNodeId].stair.stairCase).toBe(stairCase);
      expect(graph.adjacencyList[startNodeId].edges[neighbourNodeId].stair.newFloor).toBe(newFloor); 
      expect(graph.adjacencyList[startNodeId].edges[neighbourNodeId].oneDirectional).toBe(oneDirectional);
    });
  });

  describe('addNode', () => {
    it('should add a node to the adjacency list', () => {
      const graph = new Graph();
      const nodeId = 8;

      graph.addNode(nodeId, 0, 0, 1);

      expect(graph.adjacencyList[nodeId]).toBeDefined();
    });

    describe('canReachAllNodes', () => {
      it('should return true if all nodes are reachable', () => {
        const graph = new Graph();
        graph.addNode(1, 0, 0, 3);
        graph.addNode(2, 0, 0, 4);
        graph.addEdge(1, 5, 10, false, 6, 1, false);
  
        const result = graph.canReachAllNodes();
  
        expect(result).toBe(true);
      });
    });

    describe('_dfs', () => {
      it('should perform depth-first search and mark visited nodes', () => {
        const graph = new Graph();
        const nodeId1 = 1;
        const nodeId2 = 2;
        const nodeId3 = 3;
        const nodeId4 = 4;
        const nodeId5 = 5;
  
        graph.addNode(nodeId1, 3, 5, 1);
        graph.addNode(nodeId2, 10, 14, 1);
        graph.addNode(nodeId3, 67, 123, 1);
        graph.addNode(nodeId4, 43, 98, 1);
        graph.addNode(nodeId5, 21, 34, 1);
        graph.addEdge(nodeId1, nodeId2, 1, false, 1, 1, false);
        graph.addEdge(nodeId2, nodeId3, 1, false, 1, 1, false);
        graph.addEdge(nodeId3, nodeId4, 1, false, 1, 1, false);
        graph.addEdge(nodeId4, nodeId5, 1, false, 1, 1, false);
  
        const visited = {};
        graph._dfs(nodeId1, visited);
  
        expect(visited[nodeId1]).toBe(true);
        expect(visited[nodeId2]).toBe(true);
        expect(visited[nodeId3]).toBe(true);
        expect(visited[nodeId4]).toBe(true);
        expect(visited[nodeId5]).toBe(true);
      });
    });

    describe('setToControl', () => {
      it('should set node control flag and control number if node exists', () => {
        const graph = new Graph();
        const nodeId = 1;
        const controlNumber = 10;
  
        graph.addNode(nodeId, 23, 34, 3);
  
        const result = graph.setToControl(nodeId, controlNumber);
  
        expect(result).toBe(true);
        expect(graph.adjacencyList[nodeId].node.control).toBe(true);
        expect(graph.adjacencyList[nodeId].node.controlN).toBe(controlNumber);
      });
    });
  });
});