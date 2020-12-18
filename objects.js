class Node {
	/**
	 * @paran	{String}	letter	Letter that represetns the Node
	*/
	constructor(letter) {
		this.letter = letter; 
	}
}

class TreeNode extends Node{
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
		this.weight = weight; 
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
	}

	/**
	 * Checks if all Nodes in the Graph has at least one connection to connect with other nodes
	 * 
	 * @return	{boolean}	
	*/
	checkAllConnected() {

	}
	
	/**
	 * Check if the Graph has a Binary Tree structure
	*/
	isBinTree() {

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