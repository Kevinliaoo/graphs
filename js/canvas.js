let canvas = document.querySelector('canvas'); 
let context = canvas.getContext('2d');
let algorithmBtn = document.getElementById("algoBtn");
let addNodeBtn = document.getElementById("addNode");
let nodeNameInput = document.getElementById("nodeName");
let inputFrom = document.getElementById('edge_1'); 
let inputTo = document.getElementById('edge_2');
let inputWeight = document.getElementById('connectionWeight');
let connectionBtn = document.getElementById('createConnection');
let primBtn = document.getElementById('prim'); 
let dijkstraBtn = document.getElementById('dijkstra');
let fleuryBtn = document.getElementById('fleury'); 
let maxflowBtn = document.getElementById('maxflow');

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
// Algorithm Path
let path;

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

	if (path != undefined) {
		drawPath();
	}
}
animate();

/*
 * Draws the Connection in path array with red
 * 
 * FALTA BUG: 
 *     - Resolver el problema de dibujar
*/
function drawPath() {
	for (let c of path) {
		context.strokeStyle = "#FF0000";
		c.draw();
	}
	context.strokeStyle = "#000000"
}

/*
 * Converts all the Connections in the path array to a CanvasConnection object 
*/
function convertConnectionToCanvasConnection() {
	path = path.map(connection => {
		return new CanvasConnection(connection.node_1, connection.node_2, connection.weight);
	});
}

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

/*
 * Deletes a CanvasNode and all it's related CanvasConnections from circles_arrays and connection_arrays
 * 
 * @param 	{CanvasNode}	cNode 	Node to be deleted 
*/
function deleteNodeFromCanvas(cNode) {
	const nIndex = circles_arrays.indexOf(cNode); 
	
	if (nIndex === -1) return; 
	circles_arrays.splice(nIndex, 1)

	let allConnections = connection_arrays.filter(x => (x.node_1 === cNode || x.node_2 === cNode))
	for (let i of allConnections) {
		const ind = connection_arrays.indexOf(i); 
		if (ind === -1) continue; 
		connection_arrays.splice(ind, 1);
	}
}

/*
 * Check if input fields are filled and returns the values
*/
function checkNodeField(inputfield, message) {
	const node = searchNodeByName(inputfield.value.trim()); 
	inputfield.value = ""; 
	if (node === -1) {
		alert(message);
		return false
	}
	return node
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
const display_algos = ["Graph", "Dir. Graph"];
/*
 * Updates button's text when is toggled 
*/
algorithmBtn.addEventListener("click", () => {
	// Eliminar la estructura de dato si ya existe 
	toggleIndex ++; 
	if (toggleIndex === display_algos.length) toggleIndex = 0; 
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
// Delete node when user double clicks
canvas.addEventListener('dblclick', ev => {
	const x = ev.layerX; 
	const y = ev.layerY; 
	const cir = circleClicked(x, y);
	let response = window.confirm("Do you want to delete this Node?"); 
	if (response && cir != undefined) {
		// Graphs
		if (structure_name === display_algos[0]) {
			// Delete the Node and all Connections
			structure.deleteNode(cir.node); 
			// From Canvas
			deleteNodeFromCanvas(cir);
		}
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
		inputWeight.value = "";
		return;
	}
	const node_1 = checkNodeField(inputFrom, 'Please insert a valid Node in Node 1')
	if (node_1 === false) return;
	const node_2 = checkNodeField(inputTo, 'Please insert a valid Node in Node 2')
	if (node_2 === false) return;
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
	connection_arrays.push(new CanvasConnection(node_1, node_2, weight));
	// Rest input values 
	inputFrom.value = ""; 
	inputTo.value = ""; 
	inputWeight.value = "";
})

// Run PRIM algorithm
primBtn.addEventListener('click', () => {
	if (structure === undefined) return;
	path = prim(structure); 
	convertConnectionToCanvasConnection();
})

// Run DIJKSTRA algorithm
dijkstraBtn.addEventListener('click', () => {
	if (structure === undefined) return;
	const node_1 = checkNodeField(inputFrom, 'Please insert a valid Node in Node 1')
	if (node_1 === false) return;
	const node_2 = checkNodeField(inputTo, 'Please insert a valid Node in Node 2')
	if (node_2 === false) return;
	if (node_1 === node_2) return;

	path = dijkstra(structure, node_1.node, node_2.node); 
	console.log(path); 
	convertConnectionToCanvasConnection(); 
	console.log(path)
})

// Run FLEURY algorithm
fleuryBtn.addEventListener('click', () => {
	const res = fleury(structure);
	if (res != undefined) path = res; 
	else alert("Unable to find an euler cycle");
})

// Run MAXFLOW algorithm 
maxflowBtn.addEventListener('click', () => {
	if (structure === undefined) return;
	const node_1 = checkNodeField(inputFrom, 'Please insert a valid Node in Node 1')
	if (node_1 === false) return;
	const node_2 = checkNodeField(inputTo, 'Please insert a valid Node in Node 2')
	if (node_2 === false) return;
	if (node_1 === node_2) return;

	path = maxFlow(structure, node_1.node, node_2.node);
})