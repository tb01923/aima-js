const fs = require('fs')
const {Graph, Edge, Node} = require("../../abstract-data-types/graph.js")
const {makePermutations} = require("../../utility/array-permutations")


// make all combinations of where the elements can be
const boardPermutations = makePermutations(9, [1,2,3,4,5,6,7,8,null])
const answer = [null,1,2,3,4,5,6,7,8]

const builder = fs.createWriteStream('./eight-puzzle-graph.js')

const equals = x => y => x == y

const manhattanDistance = (current, destination) => {

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
const h = manhattanDistance


builder.write(`const {Graph, Edge, Node} = require("../../abstract-data-types/graph.js")\n`)
builder.write(`const graph = Graph()\n`)

const graph = Graph()


// add each permutation of the board to the graph
boardPermutations.map(permutation => {
    builder.write(`graph.addNode(Node("${permutation.join(",")}", [${permutation}], ${h(permutation, answer)}))\n`)
    //graph.addNode(Node(permutation.join(","), permutation, h(permutation, answer)))
})

// identify and add edges
boardPermutations.map(permutation => {
    const emptyIndex = permutation.findIndex(x => x == null)
    const allowLeft = emptyIndex % 3 != 2
    const allowRight = emptyIndex % 3 != 0
    const moves = permutation.map((state, index) => {
        const delta = emptyIndex - index
        return {index, delta}
    }).filter(node => {
        return node.delta == 1 && allowRight || node.delta == -1 && allowLeft || Math.abs(node.delta) == 3
    }).map((node) => {
        let label = ""
        if (node.delta == 1 && allowRight) {
            label = "RIGHT"
        } else if(node.delta == -1 && allowLeft) {
            label = "LEFT"
        } else if(node.delta == 3) {
            label = "DOWN"
        } else if(node.delta == -3) {
            label = "UP"
        }

        label += `(${permutation[node.index]})`

        const nextPermutation = permutation.slice(0)
        const temp = nextPermutation[emptyIndex]
        nextPermutation[emptyIndex] = nextPermutation[node.index]
        nextPermutation[node.index] = temp

        //graph.from(permutation.join(",")).to(nextPermutation.join(",")).withEdge(Edge(label, 1, Edge.UNIDIRECTIOAL))
        builder.write(`graph.from("${permutation.join(",")}").to("${nextPermutation.join(",")}").withEdge(Edge("${label}", 1, Edge.UNIDIRECTIOAL))\n`)
    })
})

builder.write(`module.exports = graph\n`)
builder.end()
