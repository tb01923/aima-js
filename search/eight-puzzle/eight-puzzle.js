const {defineProblem} = require('../../search/search-helpers');
const shuffle = require('../../utility/array-shuffle')

const initial = shuffle([1,2,3,4,5,6,7,8,null]).join()
// const initial = [3,1,2,
//                  null,4,5,
//                  6,7,8].join()
const answer = [null,1,2,3,4,5,6,7,8]

const directed = edge => [
    {name: edge.id, nextNode: edge.snd, cost: edge.cost}
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
            .filter(candidate => candidate.nextNode.id != node.id)
            // create constant function to that destination
            .map(K)

    return actions
}

console.log((new Date()).toISOString(), "loading search space...")
const graph = require("./eight-puzzle-graph")
console.log((new Date()).toISOString(), "loaded!")

const eightPuzzle = defineProblem(
    graph,
    (node) => node.id == answer,
    graph.getNodeById(initial),
    followGraph,
    null
)

const {bfs} = require('../known-deterministic-observable/uninformed/bfs/breadth-first-search');
const {dfs, dfs_deepening} = require('../known-deterministic-observable/uninformed/dfs/depth-first-search');

console.log((new Date()).toISOString(), "finding solution...")
const solution = dfs_deepening(eightPuzzle, 100)
console.log((new Date()).toISOString(), "complete!")

const printSolution = require('./eight-puzzle-solution-output')
printSolution(solution)