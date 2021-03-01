function makePermutations(length, data) {
    // https://stackoverflow.com/questions/27177026/derive-every-possible-combination-of-elements-in-array
    const current = new Array(length)
        , used = new Array(length)
        , seen = {}, result = [];

    function permute(pos) {
        if (pos == length) {                    // Do we have a complete combination?
            if (!seen[current]) {               // Check whether we've seen it before.
                seen[current] = true;           // If not, save it.
                result.push(current.slice());
            }
            return;
        }
        for (var i = 0; i < data.length; ++i) {
            if (!used[i]) {                     // Have we used this element before?
                used[i] = true;                 // If not, insert it and recurse.
                current[pos] = data[i];
                permute(pos+1);
                used[i] = false;                // Reset after the recursive call.
            }
        }
    }
    permute(0);
    return result;
}

module.exports = {makePermutations}