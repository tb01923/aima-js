# aima-js
aima-js

## solutions: eight puzzle
only supports DFS Iterative search; todo: apply heuristic based search

1. generate graph of eight puzzle solution (too big to check in)
```
$ cd search/eight-puzzle/
$ nvm use 14
Now using node v14.15.5 (npm v6.14.11)
$ node eight-puzzle-graph-generator.js 
```

2. verify: search/eight-puzzle/eight-puzzle-graph.js
```
$ head eight-puzzle-graph.js 
const {Graph, Edge, Node} = require("../../abstract-data-types/graph.js")
const graph = Graph()
graph.addNode(Node("1,2,3,4,5,6,7,8,", [1,2,3,4,5,6,7,8,]))
graph.addNode(Node("1,2,3,4,5,6,7,,8", [1,2,3,4,5,6,7,,8]))
graph.addNode(Node("1,2,3,4,5,6,8,7,", [1,2,3,4,5,6,8,7,]))
graph.addNode(Node("1,2,3,4,5,6,8,,7", [1,2,3,4,5,6,8,,7]))
graph.addNode(Node("1,2,3,4,5,6,,7,8", [1,2,3,4,5,6,,7,8]))
graph.addNode(Node("1,2,3,4,5,6,,8,7", [1,2,3,4,5,6,,8,7]))
graph.addNode(Node("1,2,3,4,5,7,6,8,", [1,2,3,4,5,7,6,8,]))
graph.addNode(Node("1,2,3,4,5,7,6,,8", [1,2,3,4,5,7,6,,8]))
```
3. run solution (it generates a random puzzle and solves it):
```
$ node eight-puzzle.js 
2021-03-01T19:46:25.115Z loading search space...
2021-03-01T19:46:31.730Z loaded!
2021-03-01T19:46:31.742Z finding solution...
2021-03-01T19:46:31.742Z depth limit:  1
2021-03-01T19:46:31.743Z depth limit:  2
2021-03-01T19:46:31.743Z depth limit:  3
2021-03-01T19:46:31.744Z depth limit:  4
2021-03-01T19:46:31.744Z depth limit:  n
2021-03-01T19:48:13.228Z complete!
-------------
| 8 | 5 | 2 |
|---|---|---|
| 4 | 3 | 7 |
|---|---|---|
| 6 |   | 1 |
-------------

Step: RIGHT(6)(1)
-------------
| 8 | 5 | 2 |
|---|---|---|
| 4 | 3 | 7 |
|---|---|---|
|   | 6 | 1 |
-------------
.
.
.
Step: DOWN(3)(1)
-------------
|   | 1 | 2 |
|---|---|---|
| 3 | 4 | 5 |
|---|---|---|
| 6 | 7 | 8 |
-------------
```

Where MOVE(tile-number)(cost-of-state-change)
