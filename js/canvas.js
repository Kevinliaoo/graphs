let canvas = document.querySelector('canvas'); 
let context = canvas.getContext('2d');
let algorithmBtn = document.getElementById("algoBtn");
let addNodeBtn = document.getElementById("addNode");
let nodeNameInput = document.getElementById("nodeName");

// MAIN STRUCTURE
let structure;

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

var x = 20;
function animate() {
	// Infinite loop
	requestAnimationFrame(animate);
	// Repaint background
	context.clearRect(0, 0, innerWidth, innerHeight);
	
	for (circle of circles_arrays) {
		circle.draw();
	}
}
animate();

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
	if (structure === undefined) checkDataStructure(letter); 
	// TENGO QUE ARREGLAR EL PROBLEMA DE LPS ARBOLES
	else {
		const n = new Node(letter); 
		structure.addNode(n);
		circles_arrays.push(new CanvasNode(randomNumber(0, 500), randomNumber(0, 500), n));
	}

	nodeNameInput.value = "";
})

/*
 * Builds the data structure with the root Node
 * 
 * @param 	{String}	rootNodeLetter 		Letter of the root Node 
*/
function checkDataStructure(rootNodeLetter) {
	let s = algorithmBtn.textContent; 
	const n = new Node(rootNodeLetter)
	switch(s) {
		case display_algos[0]: 
		case display_algos[1]: 
			structure = new Graph(n); 
			circles_arrays.push(new CanvasNode(randomNumber(0, 500), randomNumber(0, 500), n));
		break; 
		case display_algos[2]: 
			structure = new Tree(n);
			circles_arrays.push(new CanvasNode(randomNumber(0, 500), randomNumber(0, 500), n)); 
		break;
	}
}

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