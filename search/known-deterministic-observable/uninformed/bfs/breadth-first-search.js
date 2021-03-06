const { NotFound, Solution  }= require("../../../../utility/search-result-functor")
const {Queue} = require("../../../../abstract-data-types/queue.js")

const bfs = (problem) =>  {
    const frontier = Queue()
    const explored = new Set()

    const initialNode = problem.getInitialSearchNode()

    if (initialNode.meetsGoal()) {
        return Solution(initialNode)
    }

    frontier.enqueue(initialNode)

    while (!frontier.isEmpty()) {
        const searchNode = frontier.dequeue()
        explored.add(searchNode.state)

        // for all possible actions
        for(const action of searchNode.getActions()) {

            // get child based on action on current node
            const child = searchNode.takeAction(action)

            // if this child has not been explored and is not already on frontier
            if (!explored.has(child.state) && !frontier.contains(child)) {
                if (problem.goalTest(child.state)) {
                    child.expansion = problem.expansion
                    return Solution(child)
                }

                // push new nodes into fronteir
                frontier.enqueue(child)
            }
        }
    }

    return NotFound()
}


module.exports = {
    bfs
}