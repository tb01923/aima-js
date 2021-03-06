const {Pair} = require("../abstract-data-types/pair")

const getInstance = (self, constructor) =>
    (self instanceof constructor) ?
        self :
        Object.create(constructor.prototype) ;

const K = x => () => x

const Problem = function(states, goalTest, initialState, actions, stepCosts, heuristic=K(0)) {
    const self = getInstance(this, Problem)

    self.goalTest = goalTest
    self.initialState = initialState
    self.actions = actions
    self.stepCosts = stepCosts
    self.heuristic = heuristic

    self.getInitialSearchNode = () => SearchNode(initialState, 0, null, [], self)
    self.getActionsForState = (state) => K(self.actions(state) || [])

    return self
}

const SearchNode = function(state, g, h, steps=[], problem) {
    const self = getInstance(this, SearchNode)

    self.state = state
    self.g = g
    self.h = h
    self.steps = steps

    self.meetsGoal = K(problem.goalTest(self.state))

    self.getActions = problem && problem.getActionsForState(self.state)

    self.takeAction = action => {
        const {name, nextNode, cost} = action()
        const stepLabel = `${name} (${cost}, ~${self.f})`
        const thisStep = Pair(stepLabel, self)

        return SearchNode(
            nextNode,
            self.g + cost,
            problem.heuristic(nextNode.value) ,
            self.steps.concat([thisStep]),
            problem
        )
    }

    self.notVisited = (searchNode) => {
        return null == self.steps.find(({fst, snd}) => searchNode.state.id == snd.state.id)
    }

    return self
}

module.exports = {
    Problem
}