const { NotFound, Solution  }= require("../../../../utility/search-result-functor")
const {Queue} = require("../../../../abstract-data-types/queue.js")
const {SearchNode, getChild} = require("../../../search-helpers")

const trackExpansion = (problem, frontier) => {
    return
    problem.expansion.push(frontier.elements.slice(0))
}

const bfs = (problem) =>  {
    const frontier = Queue()
    const explored = new Set()

    const initialNode = SearchNode(problem.initialState, 0)
    if (problem.meetsGoal(initialNode.state)) {
        initialNode.expansion = problem.expansion
        return Solution(initialNode)
    }

    frontier.enqueue(initialNode)

    // not used for solution, but good for understanding
    trackExpansion(problem, frontier)

    while (!frontier.isEmpty()) {
        const node = frontier.dequeue()
        explored.add(node.state)

        // for all possible actions
        const actions =  problem.actions(node.state)
        for(const action of actions) {

            // get child based on action on current node
            const child = getChild(problem, node, action)

            // if this child has not been explored and is not already on frontier
            if (!explored.has(child.state) && !frontier.contains(child)) {
                if (problem.meetsGoal(child.state)) {
                    child.expansion = problem.expansion
                    return Solution(child)
                }

                // push new nodes into fronteir
                frontier.enqueue(child)
            }
        }
        // not used for solution, but good for understanding
        trackExpansion(problem, frontier)
    }

    return NotFound()
}


module.exports = {
    bfs
}