let a = new Node('A'); 
let b = new Node('B'); 
let c = new Node('C'); 
let d = new Node('D'); 
let e = new Node('E'); 
let f = new Node('F'); 
let g = new Node('G'); 
let h = new Node('H');
let i = new Node('I');

let graph = new Graph(a); 

graph.addNode(b); 
graph.addNode(c); 
graph.addNode(d); 
graph.addNode(e);
graph.addNode(f);
graph.addNode(g);
graph.addNode(h);

graph.connectNodes(a, b, 4); 
graph.connectNodes(b, c, 7); 
graph.connectNodes(c, d, 2); 
graph.connectNodes(d, e, 5); 
graph.connectNodes(e, f, 6); 
graph.connectNodes(f, g, 5); 
graph.connectNodes(g, a, 6);
graph.connectNodes(a, h, 4); 
graph.connectNodes(g, h, 8);
graph.connectNodes(h, e, 7); 
graph.connectNodes(h, d, 2); 
graph.connectNodes(h, c, 3); 

let dijkstraG = new Graph(a); 
dijkstraG.addNode(b);
dijkstraG.addNode(c);
dijkstraG.addNode(d);
dijkstraG.addNode(e);
dijkstraG.addNode(f);
dijkstraG.addNode(g);
dijkstraG.connectNodes(a, b, 3); 
dijkstraG.connectNodes(b, c, 8); 
dijkstraG.connectNodes(c, d, 2); 
dijkstraG.connectNodes(b, d, 3); 
dijkstraG.connectNodes(b, g, 5); 
dijkstraG.connectNodes(a, g, 6); 
dijkstraG.connectNodes(g, f, 4); 
dijkstraG.connectNodes(d, f, 4); 
dijkstraG.connectNodes(f, e, 2); 
dijkstraG.connectNodes(d, e, 5); 


// ***** TREE ***** 
let A = new TreeNode('A');
let B = new TreeNode('B'); 
let C = new TreeNode('C'); 
let D = new TreeNode('D'); 
let E = new TreeNode('E'); 
let F = new TreeNode('F'); 
let G = new TreeNode('G'); 
let H = new TreeNode('H'); 
let I = new TreeNode('I'); 

let binTree = new Tree(A);
binTree.addNode(A, B, 0); 
binTree.addNode(B, D, 0); 
binTree.addNode(B, E, 1); 
binTree.addNode(E, H, 0); 
binTree.addNode(E, I, 1); 
binTree.addNode(A, C, 1); 
binTree.addNode(C, F, 0); 
binTree.addNode(C, G, 1);

let eulerGraph = new Graph(a);
eulerGraph.addNode(b);
eulerGraph.addNode(c);
eulerGraph.addNode(d);
eulerGraph.addNode(e);
eulerGraph.addNode(f);

eulerGraph.connectNodes(a, b, 10); 
eulerGraph.connectNodes(a, c, 10); 
eulerGraph.connectNodes(a, f, 10); 
eulerGraph.connectNodes(a, e, 10);
eulerGraph.connectNodes(f, c, 10); 
eulerGraph.connectNodes(f, e, 10);
eulerGraph.connectNodes(f, d, 10)
eulerGraph.connectNodes(b, c, 10);
eulerGraph.connectNodes(c, d, 10);

console.log(findClosedPath(eulerGraph, a))

let maxFlowGraph = new Graph(a); 
maxFlowGraph.addNode(b);
maxFlowGraph.addNode(c);
maxFlowGraph.addNode(d);
maxFlowGraph.addNode(e);
maxFlowGraph.addNode(f);
maxFlowGraph.addNode(g);
maxFlowGraph.addNode(h);

maxFlowGraph.connectNodes(a, b, 8); 
maxFlowGraph.connectNodes(a, f, 5); 
maxFlowGraph.connectNodes(b, c, 5); 
maxFlowGraph.connectNodes(b, g, 4); 
maxFlowGraph.connectNodes(c, d, 6); 
maxFlowGraph.connectNodes(e, d, 6); 
maxFlowGraph.connectNodes(f, e, 4);
maxFlowGraph.connectNodes(g, h, 2); 
maxFlowGraph.connectNodes(g, e, 2); 
maxFlowGraph.connectNodes(g, f, 3);
maxFlowGraph.connectNodes(h, d, 2);