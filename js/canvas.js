let canvas = document.querySelector('canvas'); 
let context = canvas.getContext('2d');
let algorithmBtn = document.getElementById("algoBtn");
let addNodeBtn = document.getElementById("addNode");
let nodeNameInput = document.getElementById("nodeName");
let inputFrom = document.getElementById('edge_1'); 
let inputTo = document.getElementById('edge_2');
let inputWeight = document.getElementById('connectionWeight');
let connectionBtn = document.getElementById('createConnection');

// MAIN STRUCTURE
let structure;
let structure_name; 

// FIX BLURRED CANVAS
let dpi = window.devicePixelRatio;
function fix_dpi() {
	let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
	let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
	canvas.setAttribute('height', style_height * dpi);
	canvas.setAttribute('width', style_width * dpi);
}
fix_dpi()

// REDRAWING FRAME
let circles_arrays = []; 
let connection_arrays = [];

var x = 20;
function animate() {
	// Infinite loop
	requestAnimationFrame(animate);
	// Repaint background
	context.clearRect(0, 0, innerWidth, innerHeight);
	
	for (let circle of circles_arrays) {
		circle.draw();
	}
	for (let line of connection_arrays) {
		line.draw();
	}
}
animate();

/*
 * Builds the data structure with the root Node
 * 
 * @param 	{String}	rootNodeLetter 		Letter of the root Node 
*/
function checkDataStructure(rootNodeLetter) {
	let s = algorithmBtn.textContent; 
	switch(s) {
		case display_algos[0]: 
		case display_algos[1]: 
			let node = new Node(rootNodeLetter)
			structure = new Graph(node); 
			structure_name = display_algos[0];
			circles_arrays.push(new CanvasNode(randomNumber(0, 500), randomNumber(0, 500), node));
		break; 
		case display_algos[2]: 
			let treeNode = new TreeNode(rootNodeLetter);
			structure = new Tree(treeNode);
			structure_name = display_algos[2];
			circles_arrays.push(new CanvasNode(randomNumber(0, 500), randomNumber(0, 500), treeNode)); 
		break;
	}
}

/*
 * Search a created Node by it's name on circles_arrays
 * 
 * @param 	{String}	name 	Node letter
 * @return 	{Node}		Node with matching name, if any Node has a match, returns -1
*/
function searchNodeByName(name) {
	for (let circle of circles_arrays) {
		if (circle.node.letter === name) return circle;
	}
	return -1;
}

/*
 * Calculates euclidean distance between two points
 * 
 * @params 	{Number}	all		Coordenates of the points
 * @return 	{Number}	Euclidean distance
*/
const euclideanDistance = (x1, y1, x2, y2) => Math.sqrt((x1-x2)**2+(y1-y2)**2);

/*
 * Get the Node clicked in the Canvas 
 * 
 * @param 	{Number}	x 	X axis of the clicked position 
 * @param 	{Number}	y 	Y axis of the clicked position 
 * @return 	{Node}		Node clicked
*/
function circleClicked(x, y) {
	for (let circle of circles_arrays) {
		if (euclideanDistance(x, y, circle.posX, circle.posY) <= circle.radius) return circle
	}
}

// BUTTON EVENT LISTENERS

/*
 * Adds a new Node to the main structure 
*/
addNodeBtn.addEventListener("click", (ev) => {
	const letter = nodeNameInput.value.trim(); 
	if (letter === "") {
		alert("Please insert a name to the Node");
		return;
	}
	// Avoid Nodes with repeated names
	if (searchNodeByName(letter) != -1) {
		alert("Please try with other name"); 
		nodeNameInput.value = "";
		return;
	}
	// In the first time I have to create the main data structure
	if (structure === undefined) checkDataStructure(letter); 
	// TENGO QUE ARREGLAR EL PROBLEMA DE LPS ARBOLES
	else {
		let n;
		if (structure_name === display_algos[0]) { 
			n = new Node(letter); 
			structure.addNode(n);
		}
		else n = new TreeNode(letter);

		circles_arrays.push(new CanvasNode(randomNumber(0, 500), randomNumber(0, 500), n));
	}

	nodeNameInput.value = "";
})

let toggleIndex = 0; 
const display_algos = ["Graph", "Dir. Graph", "Tree"];
/*
 * Updates button's text when is toggled 
*/
algorithmBtn.addEventListener("click", () => {
	// Eliminar la estructura de dato si ya existe 
	toggleIndex ++; 
	if (toggleIndex === 3) toggleIndex = 0; 
	algorithmBtn.textContent = display_algos[toggleIndex];
})

// Canvas dragging on Canvas
let canvasDrag = {
	down: false, 
	posX: null, 
	posY: null,
	selectedObj: null,
}
canvas.addEventListener('mousedown', ev => {
	// Update canvasDrag values when user clicks a Node in the Canvas
	const x = ev.layerX; 
	const y = ev.layerY; 
	canvasDrag.down = true; 
	canvasDrag.posX = x; 
	canvasDrag.posY = y;
	const cir = circleClicked(x, y);
	if (cir != undefined) canvasDrag.selectedObj = cir;  
}, 0); 
canvas.addEventListener('mouseup', ev => {
	// Delete data on canvasDrag
	canvasDrag.down = false; 
	canvasDrag.selectedObj = undefined; 
}, 0); 
canvas.addEventListener('mousemove', ev => {
	if (canvasDrag.down && canvasDrag.selectedObj != undefined) {
		const x = ev.layerX; 
		const y = ev.layerY; 
		canvasDrag.selectedObj.posX = x; 
		canvasDrag.selectedObj.posY = y; 
		canvasDrag.selectedObj.setLetterPos();
	}
})

/*
 * Add Connections 
*/
connectionBtn.addEventListener('click', ev => {
	// Filtering
	const weight = inputWeight.value.trim();
	if (weight === '') {
		alert("Please insert a weight for the Connection");
		return;
	}
	const node_1 = searchNodeByName(inputFrom.value.trim())
	if (node_1 === -1) {
		alert("Please insert a valid Node in Node 1"); 
		inputFrom.value = ""; 
		return; 
	}
	const node_2 = searchNodeByName(inputTo.value.trim());
	if (node_2 === -1) {
		alert("Please insert a valid Node in Node 2");
		inputTo.value = "";  
		return; 
	}

	// Connect nodes of the Graph
	if (structure_name === display_algos[0]) {
		structure.connectNodes(node_1.node, node_2.node, weight);
	}
	// Connect nodes of the Tree
	else if (structure_name === display_algos[2]) {
		// Right child
		if (weight > 0) {
			// Check if right child is already connected 
			if (node_1.node.rightChild != null) {
				alert(`${node_1.node.letter} already has a right child assigned!`); 
				return;
			}
			// Connect nodes 
			structure.addNode(node_1.node, node_2.node, 1);
		}
		// Left child 
		else {
			if (node_1.node.leftChild != null) {
				alert(`${node_1.node.letter} already has a left child assigned!`); 
				return;
			}
			structure.addNode(node_1.node, node_2.node, 0);
		}
	}

	// Add new Connection to connection_arrays 
	connection_arrays.push(new CanvasConnection(node_1, node_2));
	// Rest input values 
	inputFrom.value = ""; 
	inputTo.value = ""; 
	inputWeight.value = "";
})