const {map, extract} = require('fantasy-land');
const {Graph, Edge, Node} = require("./abstract-data-types/graph.js")
const {Problem} = require('./search/problem-definition');
const {bfs} = require('./search/known-deterministic-observable/uninformed/bfs/breadth-first-search');
const {ucs} = require('./search/known-deterministic-observable/uninformed/bfs/uniform-cost-search');
const {dfs} = require('./search/known-deterministic-observable/uninformed/dfs/depth-first-search');
const {rbfs} = require('./search/known-deterministic-observable/informed/recursive-best-first-search');

const cities = Graph()
    .from("Arad").to("Zerind").withCost(75)
    .from("Arad").to("Sibiu").withCost(140)
    .from("Arad").to("Timisoara").withCost(118)
    .from("Zerind").to("Oradea").withCost(71)
    .from("Sibiu").to("Fagaras").withCost(99)
    .from("Sibiu").to("Rimnicu Vilcea").withCost(80)
    .from("Sibiu").to("Oradea").withCost(151)
    .from("Timisoara").to("Lugoj").withCost(111)
    .from("Fagaras").to("Bucharest").withCost(211)
    .from("Rimnicu Vilcea").to("Pitesti").withCost(97)
    .from("Lugoj").to("Mehadia").withCost(70)
    .from("Mehadia").to("Drobeta").withCost(75)
    .from("Drobeta").to("Craiova").withCost(120)
    .from("Craiova").to("Pitesti").withCost(138)
    .from("Craiova").to("Rimnicu Vilcea").withCost(146)
    .from("Pitesti").to("Bucharest").withCost(101)
    .from("Giugriu").to("Bucharest").withCost(90)
    .from("Urziceni").to("Bucharest").withCost(85)
    .from("Urziceni").to("Vaslui").withCost(142)
    .from("Urziceni").to("Hirsova").withCost(98)
    .from("Hirsova").to("Eforie").withCost(86)
    .from("Vaslui").to("Isai").withCost(92)
    .from("Neamt").to("Isai").withCost(87)

/*

                         a
                 b                d
         c                   c        e     f
      g    h              g    h



 */


const letters = Graph()
    .from("A").to("B").withCost(3)
    .from("A").to("D").withCost(6)
    .from("B").to("C").withCost(7)
    .from("C").to("G").withCost(5)
    .from("C").to("H").withCost(2)
    .from("D").to("C").withCost(1)
    .from("D").to("E").withCost(3)
    .from("D").to("F").withCost(1)
    .from("E").to("I").withCost(5)
    .from("F").to("J").withCost(2)
    .from("H").to("L").withCost(8)
    .from("I").to("J").withCost(1)
    .from("I").to("K").withCost(1)
    .from("I").to("M").withCost(3)
    .from("J").to("N").withCost(2)
    .from("J").to("L").withCost(5)
    .from("K").to("N").withCost(2)
    .from("L").to("N").withCost(6)
    .from("N").to("O").withCost(2)

const directed = edge => [
    {name: edge.id, nextState: edge.snd, cost: edge.g}
]

const undirected = edge => [
    {name: edge.id, nextState: edge.fst, cost: edge.g},
    {name: edge.id, nextState: edge.snd, cost: edge.g}
]


const followGraph = node => {
    const K = x => () => x
    const actions =
        // get all possible edges from this node
        node.getEdges()
        // convert each edge to an array of weighted destinations
            .map(directed)
            // flatten destinations out
            .flat()
            // remove current as a possible desitnation
            .filter(candidate => candidate.nextState.id != node.id)
            // create constant function to that destination
            .map(K)

    return actions
}

const randomDistance = (destination) => (current) => {
    return 1 //(destination.charCodeAt(0) - current.charCodeAt(0))
}

const problemFrom = (start, target, graph) => {
    return Problem(
        letters,
        (node) => node.id == target,
        graph.getNodeById(start),
        followGraph,
        null,
        randomDistance(target)
    )
}


const aradToBucharest = problemFrom("Arad", "Bucharest", cities)
const aToJ = problemFrom("A", "J", letters)

const fst = ({fst, snd}) => fst
const prettyPrint = (solution) => {
    return solution[map](
        search => "" + search.g + " [" + search.steps.map(fst).join(", ") + "]\n" + ""
            //search.expansion.map(level => "\n\t" + level.map(node => node.id || node.state.id))
    )[extract]()

}

const prettyPrint2 = (solution) => {
    const printSteps = (state, steps) => steps.map(({fst, snd}) => `-(${snd.g})-> ${snd.state.id}  `).join("") + " -> " + state.id

    return solution[map](
        search => "" + search.g + " [" + printSteps(search.state, search.steps) + "]\n" + ""
        //search.expansion.map(level => "\n\t" + level.map(node => node.id || node.state.id))
    )[extract]()

}

console.log("bfs", prettyPrint(bfs(aToJ)))
console.log("ucs", prettyPrint(ucs(aToJ)))
console.log("dfs", prettyPrint(dfs(aToJ, 10)))
console.log("rbfs", prettyPrint(rbfs(aToJ)))