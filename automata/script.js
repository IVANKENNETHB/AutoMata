class Node {
    constructor(string, state) {
        this.string = string; // sigma: {0,1}
        this.state = state; // Q: {q0,q1}
        this.children = [];
    }
}

function test() {
    const input = document.getElementById('inputString').value.trim();
    const root = new Node('Start', 'q0');
    computationalTree(root, input, 0);
    displayTree(root);
    acceptancecheck(root, input);
    // need ng magchecheck kung may ibang nainput
    // dapat 0 or 1 lang
}

// logic
function computationalTree(node, input, i) {
    if (i >= input.length) return;

    const sigma = input[i]; //array[0]
    const currentState = node.state;

    if (currentState === 'q0') {
        if (sigma === '0') {
            const newNode = new Node(sigma, 'q1'); // new Node(current sigma, '')
            node.children.push(newNode);
            computationalTree(newNode, input, i + 1);
        }
        const newNode = new Node(sigma, 'q0');
        node.children.push(newNode);
        computationalTree(newNode, input, i + 1);
    } else if (currentState === 'q1') {
        if (sigma === '0') {
            const newNode = new Node(sigma, 'p');
            node.children.push(newNode);
            computationalTree(newNode, input, i + 1);
        }
        const newNode = new Node(sigma, 'p');
        node.children.push(newNode);
        computationalTree(newNode, input, i + 1);
    }
}


function acceptancecheck(root, input) {
    let isAccepted = false;

    function traverse(node, path) {
        if (path.length === input.length && node.state === 'q1' && input.endsWith('0')) {
            isAccepted = true;
        }
        for (const child of node.children) {
            traverse(child, path + child.string);
        }
    }
    traverse(root, '');
    document.getElementById('result').innerText = isAccepted ?
        `The string "${input}" is accepted by the NFA. The language accepted is: {strings ending with 0}.`:
        `The string "${input}" is not accepted by the NFA. The language accepted is: {strings ending with 0}.`;
}

//galing kay chatgpt

function displayTree(root) {
    document.getElementById('tree').innerHTML = '';
    const width = 800; 
    const height = 500; 
    const treeLayout = d3.tree().size([width - 60, height - 60]);
    const hierarchyData = d3.hierarchy(root, node => node.children);
    const treeData = treeLayout(hierarchyData);

    const svg = d3.select("#tree")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", "translate(20, 20)");

    // Links galing chat GPT
    svg.selectAll(".link")
       .data(treeData.links())
       .enter()
       .append("line")
       .attr("class", "link")
       .attr("x1", d => d.source.x)
       .attr("y1", d => d.source.y)
       .attr("x2", d => d.target.x)
       .attr("y2", d => d.target.y)
       
       .attr("stroke", "#999")
       .attr("stroke-width", 2);

    // Nodes
    const node = svg.selectAll(".node")
                    .data(treeData.descendants())
                    .enter()
                    .append("g")
                    .attr("class", "node")
        
                    .attr("transform", d => `translate(${d.x},${d.y})`);


                    node.append("circle")
                    .attr("r", 25)
                    .attr("fill", d => {
                        if (d.data.state === 'q0' && d.data.string === 'Start') return 'lightblue'; 
                        else if (d.data.state === 'q1' && d.data.string === '0') return 'lightgreen'; 
                        else if (d.data.state === 'q1') return 'orange'; 
                        else if (d.data.state === 'q0') return 'lightcoral'; 
                        return '#ccc'; 
                    })
                    .attr("stroke", "black");
                

 
    node.append("text")
        .attr("dy", -2)
        .attr("text-anchor", "middle")
        .text(d => `${d.data.string}`);

 
    node.append("text")
        .attr("dy", 10)
        .attr("text-anchor", "middle")
        .text(d => `(${d.data.state})`);
}
