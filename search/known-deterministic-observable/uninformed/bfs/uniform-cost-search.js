const {NotFound, Solution}= require("../../../../utility/search-result-functor")
const {PriorityQueue} = require("../../../../abstract-data-types/priority-queue.js")

const ucs = (problem) =>  {
    const frontier = PriorityQueue()
    const explored = new Set()

    const initialNode = problem.getInitialSearchNode()

    if (problem.goalTest(initialNode.state)) {
        return Solution(initialNode)
    }

    frontier.enqueue(initialNode)



    while (!frontier.isEmpty()) {
        const searchNode = frontier.dequeue()

        if (searchNode.meetsGoal()) {
            return Solution(searchNode)
        }

        explored.add(searchNode.state)

        // for all possible actions
        for(const action of searchNode.getActions()) {

            // get child based on action on current node
            const child = searchNode.takeAction(action)

            // if this child has not been explored and is not already on frontier
            if (!explored.has(child.state) && !frontier.contains(child)) {
                // push new nodes into fronteir
                frontier.enqueue(child)

            }
            else if (frontier.contains(child)) {
                // if this path is lower cost path to the item on the frontier, replace the
                //      expensive path with this one
                const {idx, item} = frontier.getItem(child)
                if(child.g < item.g) {
                    frontier.replace(idx, child)
                }
            }
        }

    }

    return NotFound()
}


module.exports = {
    ucs
}