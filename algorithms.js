/**
* Check if a Node in a Tree is a leaf node 
* 
* @param	{Tree}		tree	Tree 
* @param 	{Node}		node 	Node to be evaluated
* @return 	{Boolean}	Returs true if node is a leaf node, if not, returns a list of connection to child nodes
*/
function isLeafNode(tree, node) {

	if(node.leftChild === null && node.rightChild === null) return true;

	let res = []; 
	node.leftChild != null ? res.push(node.leftChild) : res.push(null);
	node.rightChild != null ? res.push(node.rightChild) : res.push(null);

	return res;
}

/**
 * Return all Connections linked with a Node in a Graph 
 * 
 * @param	{Graph}		graph 	Graph
 * @param 	{Node}		node	Node 
 * @return	{Array}		Array containing all connections linked with the Node
*/
function getAllConnections(graph, node) {
	let connections = graph.connections.filter((c) => (c.node_1 === node || c.node_2 === node))
	return connections
}

/**
 * Returns an Array containing Nodes of the Tree ordered in pre order 
 * root -> left -> right
 * 
 * @param	{Graph}		tree	Binary Tree
 * @param 	{Node}		root 	Node to start iterating 
 * @return  {Array}				Array containing all Nodes in pre order 
*/
function preOrder(tree, root) {
	let res = []; 

	// root no es una Leaf node
	let isLeaf = isLeafNode(tree, root);
	if(isLeaf != true) {
		res.push(root);
		// Acá estoy asumiendo que el hijo izquierdo es el primer hijo y el derecho es el segundo 
		// Ejecutar recursión
		if (isLeaf[0] != null) {
			const rightPart = preOrder(tree, isLeaf[0]);
			res = res.concat(rightPart);
		} 
		if (isLeaf[1] != null) {
			const leftPart = preOrder(tree, isLeaf[1]);
			res = res.concat(leftPart); 
		} 	

		return res;
	} 
	else {
		return root;
	}
}

/**
 * Returns an Array containing Nodes of the Tree ordered in in-order 
 * left -> root -> right
 * 
 * @param	{Graph}		tree	Binary Tree
 * @param 	{Node}		root 	Node to start iterating 
 * @return  {Array}				Array containing all Nodes in in-order 
*/
function inOrder(tree, root) {

	if (root.leftChild != null) {
		var left = inOrder(tree, root.leftChild);
	}
	if (root.rightChild != null) {
		var right = inOrder(tree, root.rightChild);
	}
	if (root.rightChild === null && root.leftChild === null) {
		return [root];
	}
 
	let res = []; 
	res = res.concat(left); 
	res.push(root); 
	res = res.concat(right);

	return res
}

/**
 * Returns an Array containing Nodes of the Tree ordered in pos-order 
 * left -> right -> root
 * 
 * @param	{Graph}		tree	Binary Tree
 * @param 	{Node}		root 	Node to start iterating 
 * @return  {Array}				Array containing all Nodes in pos-order 
*/
function posOrder(tree, root) {
	if (root.leftChild != null) {
		var left = posOrder(tree, root.leftChild); 
	}
	if (root.rightChild != null) {
		var right = posOrder(tree, root.rightChild);
	}
	if (root.rightChild === null && root.leftChild === null) return [root];

	let res = []; 
	res = res.concat(left); 
	res = res.concat(right); 
	res.push (root); 

	return res;
}

/**
 * Calculates the height of a Binary Tree given the root Node to start counting 
 * 
 * @param	{Graph}		tree		Binary tree
 * @param	{Node}		rootNode	Node to start counting 
 * @return 	{Number}	Tree's height
*/
function calculateTreeHeight(tree, rootNode) {

	let result = isLeafNode(tree, rootNode); 
	
	if (result === true) {
		return 1;
	}

	let childHeights = []; 
	for (let child of result) { 
		if (child === null) continue;
		let h = calculateTreeHeight(tree, child);
		childHeights.push(h);
	}
	let res = Math.max.apply(null, childHeights) + 1;
	return res
}

/**
 * Get the shortest Connection in a Connection Array 
 * 
 * @param	{Array}		connectionsArray 	Array containing all connections 
 * @return	{Connection}		Shortest Connection inside connectionsArray
*/
function getShortestConnection(connectionsArray) {
	let shortest = 1000000;
	let shortestConnection = null;
	for (let c of connectionsArray) {
		if (c.weight < shortest) {
			shortestConnection = c; 
			shortest = c.weight;
		}
	}
	return shortestConnection;
}

/**
 * Get the Minium Spanning Tree using Prim algorithm
 * 
 * @param 	{Graph}		graph 	Graph
 * @return	{Array}				Array containing connections of the Minium Spanning Tree
*/
function prim(graph) {
	// Nodos ya recorridos 
	let passedNodes = [graph.rootNode]; 
	// Possible connections we can use that are linked with a passed node 
	let connections = []; 
	connections = connections.concat(getAllConnections(graph, graph.rootNode));

	// Connections to be returned
	let res = []; 
	let run = true; 
	while(run) {

		const shortest = getShortestConnection(connections);
		// Delete used connections 
		let index = connections.indexOf(shortest); 
		connections.splice(index, 1);

		// connections array is empty 
		if (shortest === null) {
			// Error
			console.log("An error ocurred!"); 
			break;
		}

		if (passedNodes.includes(shortest.node_1) && passedNodes.includes(shortest.node_2)) {
			// Discard the connection if both sides of the Connection are passed
			continue;
		}

		// Get the side Node of the Connection we didn't pass 
		const otherSide = passedNodes.includes(shortest.node_1) ? shortest.node_2: shortest.node_1; 
		passedNodes.push(otherSide);
		res.push(shortest);
		// Update possible connections
		connections = connections.concat(getAllConnections(graph, otherSide));

		// Algorithm finished 
		if (res.length === graph.nodes.length - 1) {
			run = false; 
		}
	}

	return res;
}

/**
 * Get the Minium Spanning Tree using Kruskal algorithm
 * FALTA BUG 
 *    - El bug que saltea algunas conexiones que no deberia saltar cuando las dos puntas ya fueron recorridas 
 * 
 * @param 	{Graph}		graph 	Graph
 * @return	{Array}				Array containing connections of the Minium Spanning Tree
*/
function kruskal(graph) {
	let passedNodes = [];
	let res = []; 

	graph.sortConnections()
	let connections = [...graph.connections];

	while(res.length != (graph.nodes.length-1)) {

		if (connections.length === 0) break;

		const shortest = connections.shift();

		if (passedNodes.includes(shortest.node_1) && passedNodes.includes(shortest.node_2)) {continue};

		const otherSide = passedNodes.includes(shortest.node_1) ? shortest.node_2: shortest.node_1; 
		passedNodes.push(otherSide);
		res.push(shortest);
	}

	return res;
}

/**
 * Find the shortest path from a start point to an end point in a Graph using Dijkstra's algorithm
 * 
 * @param	{Graph}		graph	Graph 
 * @param	{Node}		start	Starting point of the path
 * @param 	{Node}		end 	Ending point of the path
 * @return 	{Array}				Array containing each step (Connections) of the optimum path
*/
function dijkstra(graph, start, end) {
	// Check if start and end point is inside graph
	if (!graph.nodes.includes(start) || !graph.nodes.includes(end)) return;

	// Assign 1e6 value for all unvisited nodes
	let nodeDistances = graph.nodes.map(n => n != start ? 1e6 : 0);
	let queue = [start];

	// Pointers to the previous [Node, Connection]  
	let pointers = new Array(graph.nodes.length).fill(null);

	run = true;
	queueIndex = 0;
	while(run) {

		const next = queue[queueIndex];
		const nextIndex = graph.nodes.indexOf(next);
		const neighbourConnections = getAllConnections(graph, next);

		for (let conn of neighbourConnections) {
			const otherSide = conn.node_1 === next ? conn.node_2: conn.node_1;
			const otherIndex = graph.nodes.indexOf(otherSide);
			const cost = nodeDistances[nextIndex] + conn.weight; 

			if(nodeDistances[otherIndex] > cost) {
				nodeDistances[otherIndex] = cost
				pointers[otherIndex] = [next, conn];
			}

			if(!queue.includes(otherSide)) queue.push(otherSide);
		}

		queueIndex++; 

		if(queueIndex === queue.length) run = false;
	}

	// Build the path 
	let endIndex = graph.nodes.indexOf(end); 
	let previous = pointers[endIndex];
	let path = [];

	while(previous != null) {
		path.push(previous[1]);
		endIndex = graph.nodes.indexOf(previous[0]); 
		previous = pointers[endIndex];
	}

	return path.reverse() 
}

