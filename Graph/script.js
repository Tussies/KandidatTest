import {Graph, Node} from './graph.js';


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 800;

const addNodeBtn = document.getElementById("addNodeButton");
const addEdgeBtn = document.getElementById("addEdgeButton");

const mapImage = new Image();
mapImage.src = "karta1.jpeg";

mapImage.onload= function() {
    ctx.drawImage(mapImage,0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
}


const Mode = {
    UNDEFINED: 'undefined',
    ADDING_NODE: 'addingNode',
    ADDING_EDGE: 'addingEdge'
}

let mode = Mode.UNDEFINED;

let graph = new Graph();
let nNode = 0;

let srcNode = null;
let destNode = null;


addNodeBtn.addEventListener('click', function() {
    mode = Mode.ADDING_NODE;
})

addEdgeBtn.addEventListener('click', function() {
    mode = Mode.ADDING_EDGE;
})

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Draw a node at the clicked position
    if(mode === Mode.ADDING_NODE) {
    createNode(mouseX, mouseY);
    }

    if(mode === Mode.ADDING_EDGE) {
     createEdge(mouseX, mouseY);
    }
    drawGraph();
});

function createEdge(mouseX, mouseY) {
    if (!srcNode) {
        srcNode = findNode(mouseX, mouseY);
    } else {
        destNode = findNode(mouseX, mouseY);
        if (destNode && srcNode !== destNode) {
            // Add the edge between the srcNode and the destNode
            graph.addEdge(srcNode, destNode, 1);
           
        }
        
        srcNode = null;
        destNode = null;
    }
}


function findNode(x, y) {
    for (const node of Object.values(graph.adjacencyList)) {
        const posX = node.posX;
        const posY = node.posY;
        const distance = Math.sqrt((x - posX) ** 2 + (y - posY) ** 2);
        if (distance <= 10) {
            return node;
        }
    }
    return null;
}

function createNode(posX,posY) {
    let node = new Node(posX,posY,nNode);
    graph.addNode(node);
    nNode++;
}

function drawGraph() {
    for (const [nodeId, node] of Object.entries(graph.adjacencyList)) {
        drawNode(node.posX, node.posY, nodeId);
    }

    for (const node of Object.values(graph.adjacencyList)) {
        for (const neighbour of Object.values(graph.adjacencyList[node.nodeId].edges)) {
            drawEdge(node.posX,node.posY, graph.adjacencyList[neighbour.nodeId].posX, graph.adjacencyList[neighbour.nodeId].posY, neighbour.weight);
        }
    }

}

function drawNode(posX, posY, num) {
    // Draw the node as a purple circle
    ctx.beginPath();
    ctx.arc(posX, posY, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'purple';
    ctx.fill();
    ctx.closePath();
    
    // Draw the number text in white color
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '12px Arial';
    ctx.fillText(num, posX, posY);
}

function drawEdge(srcX, srcY, destX, destY, weight) {
    // Draw the edge line
    ctx.beginPath();
    ctx.moveTo(srcX, srcY);
    ctx.lineTo(destX, destY);
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // Display the weights
    const textX = (srcX + destX) / 2;
    const textY = (srcY + destY) / 2;
    ctx.fillStyle = 'cyan';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '20px Arial';
    ctx.fillText(weight, textX, textY);
}