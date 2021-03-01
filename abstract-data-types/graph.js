const getInstance = (self, constructor) =>
    (self instanceof constructor) ?
        self :
        Object.create(constructor.prototype);

const Graph = function () {
    const self = getInstance(this, Graph)

    self.nodes = {}
    self.edges = {}

    self.addNode = (node) => {
        self.nodes[node.id] = node;
        return self
    }

    self.addNodes = (...nodes) => {
        nodes.forEach(node => {
            self.nodes[node.id] = node;
        })

        return self
    }

    self.getNodeById = (id) => self.nodes[id]

    const connect = (fst, snd, edge) => {
        const _fst = self.nodes[fst.id || fst]
        const _snd = self.nodes[snd.id || snd]
        if (edge.direction == Edge.BIDIRECTIOAL) {
            edge.setNodes(_fst, _snd)
            _fst.addEdge(edge)
            _snd.addEdge(edge)
        } else {
            edge.setNodes(_fst, _snd)
            _fst.addEdge(edge)
        }
        return self
    }

    self.from = (fst) => {
        if (!self.nodes[fst.id || fst]) {
            self.nodes[fst.id || fst] = Node(fst.id || fst)
        }
        else {
            fst = self.nodes[fst] || fst
        }
        return {
            "to": (snd) => {
                if (!self.nodes[snd.id || snd]) {
                    self.nodes[snd.id || snd] = Node(snd.id || snd)
                }
                else {
                    snd = self.nodes[snd] || snd
                }
                return {
                    "withEdge": (edge) => {
                        return connect(fst, snd, edge)
                    },
                    "withCost": (cost) => {
                        return connect(fst, snd, Edge(null, cost))

                    }
                }
            }
        }
    }

    return self
}

const Node = function (id, value) {
    const self = getInstance(this, Node)

    self.id = id
    self.value = (arguments.length > 1) ? value : id
    self.edges = []

    self.addEdge = (edge) => {
        self.edges.push(edge);
        return self
    }

    // self.getChildren = (depth=1) => {
    //     return self.edges
    //         .map(edge => [edge.fst, edge.snd])
    //         .flat()
    //         .filter(node => node.id != self.id)
    // }

    self.getEdges = (depth = 1) => {
        return self.edges
    }

    return self
}

const Edge = function (id, cost, direction) {

    const self = getInstance(this, Edge)
    self.id = id
    self.cost = (arguments.length > 1) ? cost : 0
    self.direction = direction || Edge.BIDIRECTIOAL

    self.setNodes = (fst, snd, direction) => {

        if (!self.id) {
            self.id = fst.id + "-to-" + snd.id
        }

        self.fst = fst
        self.snd = snd
        return self
    }

    return self
}
Edge.UNIDIRECTIOAL = 1
Edge.BIDIRECTIOAL = 2

module.exports = {
    Graph, Node, Edge
}

/*
const g = Graph()
    .addNode(Node("A"))
    .addNode(Node("B"))
    .addNode(Node("C"))
    .from("A").to("C").withEdge(Edge())
    .from("A").to("B").withEdge(Edge())

g.nodes["A"].getFrontierNodes()
*/
