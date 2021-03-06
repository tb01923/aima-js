const {NotFound, Solution, SearchLimitExhausted} = require("../../../../utility/search-result-functor")

const dfs = (problem, limit = 3) =>
    dfs_recursive(problem, limit, problem.getInitialSearchNode())


const dfs_recursive = (problem, limit, searchNode) => {
    if (searchNode.meetsGoal()) {
        return Solution(searchNode)
    } else if (limit == 0) {
        return SearchLimitExhausted()
    }


    let isSearchLimit = false

    // reverse actions for "stack" (LIFO) behavior
    for (const action of searchNode.getActions().reverse()) {

        // get child based on action on current node
        const childNode = searchNode.takeAction(action)

        // verify that this child hasn't been visited on the path of this searchNode
        //  to avoid paths that cycle between nodes
        if (searchNode.notVisited(childNode)) {

            const result = dfs_recursive(problem, limit - 1, childNode)

            if (result instanceof Solution) {
                return result
            }
            else if (result instanceof SearchLimitExhausted) {
                isSearchLimit = true
            }
        }

    }

    // if a solution was found, it would have exited by this point.
    //  we either failed to find a solution because it doesn't exist
    //  or the search depth limit was reached on all actions.
    if (isSearchLimit) {
        return SearchLimitExhausted()
    } else {
        return NotFound()
    }
}

const dfs_deepening = (problem, limit = 10) => {
    for (let i = 1; i <= limit; i++) {
        console.log((new Date()).toISOString(), "depth limit: ", i)
        const r = dfs(problem, i)
        if (r instanceof Solution) {
            return r
        } else if (r instanceof NotFound) {
            return r
        }
    }

    return SearchLimitExhausted()
}


module.exports = {
    dfs, dfs_deepening
}