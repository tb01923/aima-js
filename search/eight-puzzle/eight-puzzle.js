const {Problem} = require('../problem-definition');
const shuffle = require('../../utility/array-shuffle')

const initial = shuffle([1,2,3,4,5,6,7,8,null]).join()
// const initial = [3,1,2,
//                  null,4,5,
//                  6,7,8].join()
const answer = [null,1,2,3,4,5,6,7,8]

const directed = edge => [
    {name: edge.id, nextNode: edge.snd, cost: edge.g}
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

const equals = x => y => x == y
const manhattanDistance = (destination) => (current) => {
    return current.reduce((totalDistance, cVal, c) => {
        const d = destination.findIndex(equals(cVal))
        const dRow = Math.ceil((d + 1) * 3 / 9)
        const dCol = (d % 3) + 1

        const cRow = Math.ceil((c + 1) * 3 / 9)
        const cCol = (c % 3) + 1

        const cellDistance = Math.abs(dRow - cRow) + Math.abs(dCol - cCol)
        return totalDistance +  cellDistance
    }, 0)
}


console.log((new Date()).toISOString(), "loading search space...")
const graph = require("./eight-puzzle-graph")
console.log((new Date()).toISOString(), "loaded!")

const eightPuzzle = Problem(
    graph,
    (node) => node.id == answer.join(),
    graph.getNodeById(initial),
    followGraph,
    null,
    manhattanDistance(answer)
)

const {bfs} = require('../known-deterministic-observable/uninformed/bfs/breadth-first-search');
const {dfs, dfs_deepening} = require('../known-deterministic-observable/uninformed/dfs/depth-first-search');
const {rbfs} = require('../known-deterministic-observable/informed/recursive-best-first-search');

console.log((new Date()).toISOString(), "finding solution...")
const solution = rbfs(eightPuzzle, 100)
console.log((new Date()).toISOString(), "complete!")

const printSolution = require('./eight-puzzle-solution-output')
printSolution(solution)