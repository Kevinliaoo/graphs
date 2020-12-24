class Node {
	/**
	 * @paran	{String}	letter	Letter that represetns the Node
	*/
	constructor(letter) {
		this.letter = letter; 
	}
}

class TreeNode extends Node {
	constructor(letter) {
		super(letter);
		this.leftChild = null; 
		this.rightChild = null; 
	}

	setLeftChild(node) {
		this.leftChild = node; 
	}

	setRightChild(node) {
		this.rightChild = node;
	}
}

class Connection {
	/**
	 * @param 	{Node}		node_1		Node 1
	 * @param	{Node}		node_2 		Node 2
	 * @param	{Number}	weight		Length of the Connection 	
	*/
	constructor(node_1, node_2, weight) {
		this.node_1 = node_1; 
		this.node_2 = node_2; 
		this.weight = parseInt(weight); 
	}
}

class Graph {
	/**
	 * @param	{Node}	rootNode	Root node of the Graph
	*/
	constructor(rootNode) {
		this.rootNode = rootNode; 
		this.nodes = [rootNode];
		this.nodesDegree = []; 
		this.connections = []; 
	}

	/**
	 * Adds a new Node to the Graph that will NOT be connected to any node existing in the Graph 
	 * 
	 * @param	{Node}	node	New Node to be added 
	*/
	addNode(node) {
		if (!this.nodes.includes(node)) {
			this.nodes.push(node);
		}
	}

	/**
	 * Connects two nodes grom the Graph one to the other 
	 * Creates a new Connection and adds it to the this.connections array 
	 * 
	 * @param	{Node}		node_1		Node 1 to be connected
	 * @param	{Node}		node_2		Node 2 to be connected 
	 * @param	{Number}	weight		Length of the connection
	*/
	connectNodes(node_1, node_2, weight) {
		let c = new Connection(node_1, node_2, weight); 
		this.connections.push(c); 
	}

	/**
	 * Sorts the connections of the Graph according to weight
	*/
	sortConnections() {
		for (let i = 1; i < this.connections.length; i++) {
			let key = this.connections[i]; 
			let j = i - 1; 

			while (j >= 0 && key.weight < this.connections[j].weight) {
				this.connections[j+1] = this.connections[j]; 
				j --; 
			}
			this.connections[j+1] = key;
		}
	}

	/**
	* Calculates the degree of each Node of the Graph 
	*/
	getNodesDegree() {
		this.nodesDegree = []; 
		for (let node of this.nodes) {
			let connections = this.connections.filter((c) => (c.node_1 === node || c.node_2 === node))
			this.nodesDegree.push(connections.length); 
		}

		return this.nodesDegree;
	}

	/*
	 * Deletes a Node and all Connections related to it
	 * 
	 * @param 	{Node}		node 	Node to be deleted 
	 * @return 	{Boolean}	If elements were correctly deleted
	*/
	deleteNode(node) {
		// Filtering 
		if (node === this.rootNode) {
			alert("You can not delete the Root Node!"); 
			return false; 
		}
		const nodeIndex = this.nodes.indexOf(node);
		if (nodeIndex === -1) return false;

		// Delete Node
		this.nodes.splice(nodeIndex, 1);
		let nodeConnections = getAllConnections(this, node); 
 		// Delete connections
		for (let c of nodeConnections) {
			const cIndex = this.connections.indexOf(c); 
			if (cIndex === -1) continue; 
			this.connections.splice(cIndex, 1);
		}
		return true;
	}
}

class Tree {
	constructor(root) {
		this.rootNode = root; 
	}

	/**
	 * Attach a child TreeNode to a Node in the Tree
	 * 
	 * @param	{TreeNode}	parent		Parent Node of the new Node which to be attached
	 * @param 	{TreeNode}	node		New Node to be inserted in the Tree 
	 * @param 	{boolean}	position 	0 -> left   1 -> right  
	*/
	addNode(parent, node, position) {
		position === 0 ? parent.setLeftChild(node) : parent.setRightChild(node);
	}
}

class CanvasConnection {

	/*
	 * @param 	{CanvasNode} 	node_1		Node 1 
	 * @param 	{CanvasNode}	node_2 		Node 2
	*/
	constructor(node_1, node_2, weight) {
		this.node_1 = node_1; 
		this.node_2 = node_2;
		this.weight = parseInt(weight);
		this.color = "#000000"; 
		this.lineWidth = 2; 
	}

	draw() {
		context.strokeStyle = this.color;
		context.lineWidth = this.lineWidth;
		context.beginPath(); 
		context.moveTo(this.node_1.posX, this.node_1.posY); 
		context.lineTo(this.node_2.posX, this.node_2.posY); 
		context.stroke();

		context.font = "bold 14px Georgia";
		const minX = this.node_1.posX < this.node_2.posX ? this.node_1.posX : this.node_2.posX
		const minY = this.node_1.posY < this.node_2.posY ? this.node_1.posY : this.node_2.posY
		const middleX = Math.abs(this.node_1.posX - this.node_2.posX)/2; 
		const middleY = Math.abs(this.node_1.posY - this.node_2.posY)/2; 
		context.fillText(this.weight, minX+middleX, minY+middleY);

	}
}

class CanvasNode {

	/*
	 * @param 	{Number}	posX 	X axis position on Canvas
	 * @param 	{Number}	posY 	Y axis position on Canvas
	 * @param 	{Node}		nodePointer	Node that current CanvasNode points
	*/
	constructor(posX, posY, nodePointer) {
		this.radius = 8;
		this.posX = posX; 
		this.posY = posY; 
		this.gap = 15;
		this.letterX = posX + this.gap; 
		this.letterY = posY - this.gap; 
		this.node = nodePointer; 
	}

	/*
	 * Draws the Node on the Canvas
	*/
	draw() {
		// Draw point 
		context.beginPath();
		context.arc(this.posX, this.posY, this.radius, Math.PI*2, false);
		context.fill();
		// Node name 
		this.setLetterPos();
		context.font = "bold 12px Georgia";
		context.fillText(this.node.letter, this.letterX, this.letterY);
	}

	/*
 	 * Adjusts the name text position on Canvas
	*/
	setLetterPos() {
		let textWidth = context.measureText(this.node.letter).width; 
		let textHeight = context.measureText(this.node.letter).height; 
		this.letterX = this.posX + this.gap; 
		this.letterY = this.posY - this.gap; 
		if (this.posX < 20) this.letterX = this.posX + this.gap; 
		if (this.posY < 20) this.letterY = this.posY + this.gap;
		if (this.posY > canvas.height - 20) this.letterY = this.posY - this.gap;
		if (this.posX + textWidth > canvas.width - 20) this.letterX = this.posX - 2*this.gap - textWidth;
	}
}