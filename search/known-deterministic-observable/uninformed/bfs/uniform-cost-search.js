const {NotFound, Solution}= require("../../../../utility/search-result-functor")
const {PriorityQueue} = require("../../../../abstract-data-types/priority-queue.js")
const {SearchNode, getChild} = require("../../../problem-definition")

const trackExpansion = (problem, frontier) => {
    return
    problem.expansion.push(frontier.elements.slice(0))
}

const ucs = (problem) =>  {
    const frontier = PriorityQueue()
    const explored = new Set()

    const initialNode = SearchNode(problem.initialState, 0)
    if (problem.meetsGoal(initialNode.state)) {
        return Solution(initialNode)
    }

    frontier.enqueue(initialNode)
    // not used for solution, but good for understanding
    trackExpansion(problem, frontier)


    while (!frontier.isEmpty()) {
        const node = frontier.dequeue()
        if (problem.meetsGoal(node.state)) {
            node.expansion = problem.expansion
            return Solution(node)
        }

        explored.add(node.state)

        // for all possible actions
        const actions =  problem.actions(node.state)
        for(const action of actions) {

            // get child based on action on current node
            const child = getChild(problem, node, action)

            // if this child has not been explored and is not already on frontier
            if (!explored.has(child.state) && !frontier.contains(child)) {
                // push new nodes into fronteir
                frontier.enqueue(child)
                problem.expansion.push(frontier.elements.slice(0))
            }
            else if (frontier.contains(child)) {
                // if this path is lower cost path to the item on the frontier, replace the
                //      expensive path with this one
                const {idx, item} = frontier.getItem(child)
                if(child.cost < item.cost) {
                    frontier.replace(idx, child)
                }
            }
        }
        // not used for solution, but good for understanding
        trackExpansion(problem, frontier)
    }

    return NotFound()
}


module.exports = {
    ucs
}