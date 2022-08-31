function makeCombinations(length, data) {
    // https://stackoverflow.com/questions/27177026/derive-every-possible-combination-of-elements-in-array
    const current = new Array(length)
        , used = new Array(length)
        , seen = {}, result = [];

    function combine(pos) {
        if (pos == length) {
            // combination order doesn't matter, so check reverse too
            // console.log("tst", `${current[0].row} ${current[0].col}, ${current[1].row} ${current[1].col}` )

            if (!seen[current] && ! seen[current.slice().reverse()]) {
                // console.log("add", `${current[0].row} ${current[0].col}, ${current[1].row} ${current[1].col}` )
                seen[current] = true;
                result.push(current.slice());
            }
            return;
        }
        for (var i = 0; i < data.length; ++i) {
            if (!used[i]) {
                used[i] = true;
                current[pos] = data[i];
                combine(pos+1);
                used[i] = false;
            }
        }
    }
    combine(0);
    return result;
}

module.exports = {makeCombinations}