const {map, extract} = require('fantasy-land');
const {Graph, Edge, Node} = require("./abstract-data-types/graph.js")
const {defineProblem} = require('./search/search-helpers');
const {bfs} = require('./search/known-deterministic-observable/uninformed/bfs/breadth-first-search');

const directed = edge => [
    {name: edge.id, nextNode: edge.snd, cost: edge.cost}
]

const followGraph = node => {
    const K = x => () => x
    const actions =
        // get all possible edges from this node
        node.getEdges()
        // convert each edge to an array of weighted destinations
            .map(undirected)
            // flatten destinations out
            .flat()
            // remove current as a possible desitnation
            .filter(candidate => candidate.nextNode.id != node.id)
            // create constant function to that destination
            .map(K)

    return actions
}


const makeBoard = board => {
    const makeRow = row => row.map(col => {
        let val = "  "
        if (col != null) {
            val = " " + col
        }
        val += " |"
        return val
    }).join("")

    const boundary = "-------------\n"
    const rowSeparator = "|---|---|---|\n"
    const rows = board.map(row => "|" + makeRow(row) + "\n")

    const boardLayout = boundary + rows[0] + rowSeparator + rows[1] + rowSeparator + rows[2] + boundary
    return boardLayout
}


let board = (new Array(null, null, null)).map(r => new Array(null, null, null))

let ticTacToeGraph = Graph()
    .addNode(Node("", [[null,null,null],[null,null,null],[null,null,null]]))
    .addNode(Node("", [[null,null,null],[null,"X",null],[null,null,null]]))
    .addNode(Node("", [[null,null,null],[null,"X",null],[null,"O",null]]))



const input = require('readline-sync');
while (true) {
    console.log(makeBoard(board))
    const position = input.question("x Moves: ")
    const row = Math.ceil((position * 3 / 9) - 1)
    const col = (position - 1) % 3

    board[row][col] = "X"

    const ticTacToe = defineProblem(
        ticTacToeGraph,
        (node) => node.id == target,
        graph.getNodeById(board),
        followGraph,
        null
    )
}

