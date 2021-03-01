
const getInstance = (self, constructor) =>
    (self instanceof constructor) ?
        self :
        Object.create(constructor.prototype) ;

const defineProblem = (states, meetsGoal, initialState, actions, stepCosts) => {
    return {
        meetsGoal, initialState, actions, stepCosts, expansion: []
    }
}

const SearchNode = function(state, cost, steps=[]) {
    const self = getInstance(this, SearchNode)

    self.state = state
    self.cost = cost
    self.steps = steps

    self.notVisited = (searchNode) => {
        return null == self.steps.find(({fst, snd}) => searchNode.state.id == snd.state.id)
    }

    return self
}

const Pair = function (fst, snd) {
    const self = getInstance(this, Pair)
    self.fst = fst
    self.snd = snd

    self.toString = function() {
        return `Pair(${self.fst},${self.snd})`
    }

    return self
}

const getChild = (problem, searchNode, action) => {
    const {name, nextNode, cost} = action()
    const stepLabel = name + "(" + cost + ")"
    const thisStep = Pair(stepLabel, searchNode)
    return SearchNode(nextNode, searchNode.cost + cost, searchNode.steps.concat([thisStep]))
}

module.exports = {
    defineProblem, SearchNode, getChild
}